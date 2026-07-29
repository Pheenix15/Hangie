import * as Location from "expo-location";

// Gets the device's current location and resolves it to neighborhood/city/region/country only
export async function getCurrentGeneralLocation() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return { location: null, error: "Location permission was denied." };
    }

    // Get precise coordinates - used only momentarily here, never stored anywhere
    const position = await Location.getCurrentPositionAsync({});

    const results = await Location.reverseGeocodeAsync({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });

    if (!results.length) {
      return { location: null, error: "Could not determine location." };
    }

    // Pull only the general-area fields - street, name, postal code are left out on purpose
    const { district, city, region, country } = results[0];

    return {
      location: { neighborhood: district, city, region, country },
      error: null,
    };
  } catch (err) {
    // Catches cases like location services being turned off on the device
    return {
      location: null,
      error:
        "Location services are turned off. Please enable them and try again.",
    };
  }
}

// Searches for location suggestions as the user types, using LocationIQ's autocomplete
export async function searchLocations(query) {
  if (query.length < 3) {
    return { results: [], error: null };
  }

  const apiKey = process.env.EXPO_PUBLIC_LOCATIONIQ_KEY;
  const url = `https://api.locationiq.com/v1/autocomplete?key=${apiKey}&q=${encodeURIComponent(query)}&limit=5&dedupe=1`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    const data = await response.json();

    // TEMPORARY - logs the raw response to inspect LocationIQ's actual field names
    console.log("LocationIQ raw response:", JSON.stringify(data, null, 2));

    if (!Array.isArray(data)) {
      return { results: [], error: null };
    }

    const results = data
      .map((item) => ({
        neighborhood:
          item.address?.suburb ||
          item.address?.neighbourhood ||
          item.address?.name ||
          null,
        city: item.address?.city || item.address?.county || null,
        region: item.address?.state || null,
        country: item.address?.country || null,
        displayName: item.display_name,
      }))
      .filter((location) => location.neighborhood !== null); //Block locations with NULL neghborhood values

    // TEMPORARY - logs the mapped result to confirm what actually got extracted
    console.log("Mapped location results:", results);

    return { results, error: null };
  } catch (err) {
    clearTimeout(timeout);
    return {
      results: [],
      error: "Could not search locations. Check your connection.",
    };
  }
}
