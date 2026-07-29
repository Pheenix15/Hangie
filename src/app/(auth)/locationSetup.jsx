import MaterialIcons from "@react-native-vector-icons/material-icons";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Button from "../../components/ui/button";
import Input from "../../components/ui/textInput";
import { COLORS, FONT_SIZE } from "../../constants/brand";
import { getSession } from "../../services/auth";
import {
  getCurrentGeneralLocation,
  searchLocations,
} from "../../services/location";
import { updateProfile } from "../../services/profile";
import { globalStyles } from "../../styles/global";

export default function locationSetup() {
  const [neighbourhood, setNeighbourhood] = useState("");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [detectedLocation, setDetectedLocation] = useState(null); //Detected from devices GPS
  const [selectedLocation, setSelectedLocation] = useState(null); //Selected from suggestions or detected location
  const [locationLoading, setLocationLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Keeps track of the debounce timer so we can cancel it between keystrokes
  const debounceTimer = useRef(null);

  // Runs every time the user types in the search field
  const handleQueryChange = (text) => {
    setQuery(text);
    setSelectedLocation(null);

    // Cancel the previous pending search so we don't fire one on every keystroke
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Wait 400ms after the user stops typing before actually searching
    debounceTimer.current = setTimeout(async () => {
      const { results, error } = await searchLocations(text);

      if (error) {
        setTimeout(() => {
          setErrorMessage(error);
        }, 5000);

        return;
      }

      setSuggestions(results);
    }, 400);
  };

  // Runs when the user taps one of the dropdown suggestions
  const handleSelectSuggestion = (suggestion) => {
    setDetectedLocation(null); // Clear detected location if user selects a suggestion
    setSelectedLocation(suggestion);
    setQuery(
      `${suggestion.neighborhood}, ${suggestion.region || suggestion.city}`,
    );
    setSuggestions([]);
  };

  // Runs when the user taps "Use my current location"
  const handleUseCurrentLocation = async () => {
    setLocationLoading(true);
    setErrorMessage("");

    const { location, error } = await getCurrentGeneralLocation();

    if (error) {
      setErrorMessage(error);

      setTimeout(() => {
        setErrorMessage("");
      }, 500);
      setLocationLoading(false);
      return;
    }

    // Neighborhood is required app-wide, GPS results without one are rejected here
    if (!location.neighborhood) {
      setErrorMessage(
        "We Could not determine your specific area. Please search and select a location manually.",
      );

      setTimeout(() => {
        setErrorMessage("");
      }, 5000);

      setLocationLoading(false);
      return;
    }

    setDetectedLocation(location);
    setSelectedLocation(location);
    setQuery(`${location.neighborhood}, ${location.region || location.city}`);
    setSuggestions([]);
    setLocationLoading(false);
  };

  // Runs when the user submits the location screen
  const handleLocationSetup = async () => {
    setErrorMessage("");
    setLoading(true);

    if (!selectedLocation) {
      setErrorMessage(
        "Please select a location from the suggestions, or use your current location.",
      );

      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      setLoading(false);

      return;
    }

    // SAFEGUARD - neighborhood must exist before location can be submitted
    if (!selectedLocation.neighborhood) {
      setErrorMessage(
        "Couldn't determine a specific area. Please search and select a location manually.",
      );

      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      setLoading(false);
      return;
    }

    // Checks if user is logged in
    const { session, error: sessionError } = await getSession();

    if (sessionError || !session) {
      setErrorMessage("You must be logged in to continue.");

      setTimeout(() => {
        setErrorMessage("");
      }, 5000);

      setLoading(false);
      return;
    }

    const userId = session.user.id;

    const { neighborhood, city, region, country } = selectedLocation;

    const { profile, error: updateError } = await updateProfile(userId, {
      neighborhood,
      city,
      region,
      country,
    });

    if (updateError) {
      setErrorMessage(updateError);

      setTimeout(() => {
        setErrorMessage("");
      }, 5000);

      setLoading(false);
      return;
    }

    setLoading(false);
    router.replace("/(tabs)/feeds");
  };

  return (
    <View style={[globalStyles.screen, locationSetupStyle.screen]}>
      {errorMessage && <Text style={globalStyles.error}>{errorMessage}</Text>}

      {/* Intro */}
      <View>
        <Text style={globalStyles.introText}>Where are you based?</Text>
        <Text style={globalStyles.subText}>
          We only show you hangouts within your neigbhourhood. We never share
          your exact location.
        </Text>
      </View>

      {/* location input */}
      <View style={locationSetupStyle.locationContainer}>
        <Pressable
          onPress={handleUseCurrentLocation}
          style={[
            globalStyles.input,
            locationSetupStyle.locationPickerContainer,
          ]}
        >
          {locationLoading ? (
            <ActivityIndicator color={COLORS.primary} />
          ) : (
            <View style={locationSetupStyle.locationPicker}>
              <MaterialIcons
                name="my-location"
                size={24}
                color={COLORS.primary}
              />

              <Text style={locationSetupStyle.locationPickerText}>
                Use my current location
              </Text>
            </View>
          )}
        </Pressable>

        <Text style={[locationSetupStyle.orText]}>or enter manually</Text>

        {/* Location Input */}
        <View>
          {/* Location Input with icon*/}
          <View style={[globalStyles.input, locationSetupStyle.locationInput]}>
            <MaterialIcons
              name="search"
              size={24}
              color={COLORS.textSecondary}
            />
            <Input
              placeholder="Search your area..."
              value={query}
              onChangeText={handleQueryChange}
              autoCapitalize="none"
              style={locationSetupStyle.input}
            />
          </View>

          {suggestions.length > 0 && (
            <FlatList
              data={suggestions}
              keyExtractor={(item, index) => index.toString()}
              style={locationSetupStyle.suggestionsList}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleSelectSuggestion(item)}
                  style={locationSetupStyle.suggestionItem}
                >
                  <Text style={locationSetupStyle.suggestionText}>
                    {item.displayName}
                  </Text>
                </Pressable>
              )}
            />
          )}
        </View>
      </View>

      {/* Users Location */}
      {selectedLocation && (
        <View style={locationSetupStyle.confirmationBox}>
          <Text style={locationSetupStyle.confirmationText}>
            {`${selectedLocation.neighborhood}, ${selectedLocation.region || selectedLocation.city}`}
          </Text>

          <Text style={locationSetupStyle.confirmationsubText}>
            Location set — you can change this anytime
          </Text>
        </View>
      )}

      {/* Disclaimer */}
      <View style={locationSetupStyle.disclaimer}>
        <MaterialIcons name="lock" size={19} color={COLORS.textSecondary} />

        <Text style={locationSetupStyle.disclaimerText}>
          We use your area (not your exact address) to match you with nearby
          hangouts. Other users see only your neighbourhood — never your street
          or building.
        </Text>
      </View>

      <Button
        title={
          loading ? <ActivityIndicator color={COLORS.white} /> : "Continue"
        }
        variant="fill"
        onPress={handleLocationSetup}
      />
    </View>
  );
}

const locationSetupStyle = StyleSheet.create({
  screen: {
    gap: 15,
  },

  locationContainer: {
    gap: 15,
  },

  locationPickerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  locationPicker: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  locationPickerText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: 700,
  },

  orText: {
    color: COLORS.textSecondary,
    textAlign: "center",
    fontWeight: 700,
  },

  locationInput: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  input: {
    borderColor: "transparent",
    backgroundColor: "transparent",
    padding: 2,
  },

  suggestionsList: {
    backgroundColor: COLORS.surface,
    padding: 15,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },

  suggestionText: {
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
    paddingBottom: 5,
    paddingTop: 5,
  },

  confirmationBox: {
    backgroundColor: COLORS.success,
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },

  confirmationText: {
    color: COLORS.textSuccess,
    fontSize: FONT_SIZE.md,
    fontWeight: 600,
  },

  confirmationsubText: {
    color: COLORS.textSuccess,
    fontSize: FONT_SIZE.sm,
  },

  disclaimer: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: COLORS.surface,
    marginTop: 20,
    marginBottom: 15,
    padding: 15,
    borderRadius: 9,
  },

  disclaimerText: {
    flexShrink: 1, //So text wraps
  },
});
