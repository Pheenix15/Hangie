import Lucide from "@react-native-vector-icons/lucide";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { COLORS } from "../../constants/brand";

// Placeholder AI-recommended venues until the real recommender is built
const STUB_VENUES = [
  {
    id: "v1",
    name: "Lekki Art Garden",
    distance: "1.2km",
    hours: "Open Sat 10–7",
    capacity: 20,
    tag: "Best fit",
    note: "AI can book this venue",
    noteType: "success",
  },
  {
    id: "v2",
    name: "Rooftop Social, Lekki Phase 1",
    distance: "2.1km",
    hours: "Open Sat 9–8",
    capacity: 15,
    tag: "Free space",
    note: "No booking needed — public space",
    noteType: "neutral",
  },
  {
    id: "v3",
    name: "The Creative Hub, VI",
    distance: "4.3km",
    hours: "Open Sat 10–6",
    capacity: 30,
    tag: "Requires booking",
    note: "You'll need to call ahead",
    noteType: "warning",
  },
];

export default function WhereStep({
  formData,
  updateFormData,
  onNext,
  onBack,
}) {
  // Whether the custom-location search input is showing instead of the venue list
  const [isAddingCustom, setAddingCustom] = useState(false);
  // Sets the chosen venue from the AI-recommended list, storing exactly what the events table needs
  const selectVenue = (venue) => {
    updateFormData({
      venueName: venue.name,
      formattedAddress: null,
      city: null,
      latitude: null,
      longitude: null,
    });
  };

  const canContinue = formData.venueName !== null;

  return (
    <View style={whereStepStyle.screen}>
      <View style={whereStepStyle.banner}>
        <Lucide name="sparkles" size={18} color={COLORS.primary} />
        <Text style={whereStepStyle.bannerText}>
          <Text style={whereStepStyle.bannerBold}>
            AI found {STUB_VENUES.length} venues{" "}
          </Text>
          that suit this hangout. Ranked by fit.
        </Text>
      </View>

      {!isAddingCustom && (
        <>
          <Text style={whereStepStyle.sectionLabel}>AI-recommended venues</Text>

          {STUB_VENUES.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              selected={formData.venueName === venue.name}
              onPress={() => selectVenue(venue)}
            />
          ))}
        </>
      )}

      <Pressable
        style={whereStepStyle.addCustomButton}
        onPress={() => setAddingCustom(true)}
      >
        <Lucide name="plus" size={16} color={COLORS.textSecondary} />
        <Text style={whereStepStyle.addCustomLabel}>Add a custom location</Text>
      </Pressable>
    </View>
  );
}
