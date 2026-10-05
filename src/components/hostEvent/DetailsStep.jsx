import Lucide from "@react-native-vector-icons/lucide";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import DetailsStepSkeleton from "../../components/loading/detailsStepSkeleton";
import { COLORS, FONT_SIZE } from "../../constants/brand";
import { MAX_GROUP_SIZE, MIN_GROUP_SIZE } from "../../constants/hangout";
import { useAuthContext } from "../../context/AuthContext";
import { useHostEventOptions } from "../../hooks/useHostEventOptions";
import Button from "../ui/button";
import TextInput from "../ui/textInput";

export default function DetailsStep({ formData, updateFormData, onNext }) {
  const { session } = useAuthContext();
  const { interests, vibes, loading } = useHostEventOptions(session?.user.id);
  // Holds whatever the host is currently typing into the activity input, cleared after each enter
  const [activityInput, setActivityInput] = useState("");
  // Loading screen
  if (loading) {
    return <DetailsStepSkeleton />;
  }

  // HANGOUT TYPE
  // Sets the selected hangout type,
  const selectInterest = (interestId) => {
    updateFormData({ hangoutType: interestId });
  };

  // VIBE
  // Toggles a vibe id in or out of the selected vibes list
  const toggleVibe = (vibeId) => {
    const isSelected = formData.vibe.includes(vibeId);

    const updated = isSelected
      ? formData.vibe.filter((id) => id !== vibeId)
      : [...formData.vibe, vibeId];

    updateFormData({ vibe: updated });
  };

  // ACTIVITY
  // Adds whatever's typed into the activity input to the list, then clears the input
  const addActivity = () => {
    // Ignore empty submissions so blank entries don't get added
    if (activityInput.trim() === "") return;
    // console.log("Adding activity:", activityInput.trim()); // Debug
    updateFormData({
      activities: [...formData.activities, activityInput.trim()],
    });
    setActivityInput("");
  };

  // Removes a single activity from the list by its index
  const removeActivity = (index) => {
    updateFormData({
      activities: formData.activities.filter((_, i) => i !== index),
    });
  };

  // GROUP SIZE
  // Moves group size up by one, stopping at the max unless "no cap" is checked
  const incrementGroupSize = () => {
    if (formData.noGroupSizeCap) return;
    if (formData.groupSize >= MAX_GROUP_SIZE) return;
    updateFormData({ groupSize: formData.groupSize + 1 });
  };

  // Moves group size down by one, stopping at the minimum
  const decrementGroupSize = () => {
    if (formData.groupSize <= MIN_GROUP_SIZE) return;
    updateFormData({ groupSize: formData.groupSize - 1 });
  };

  // Toggles the no-cap checkbox, resetting to max when turned on so the stored value stays meaningful
  const toggleNoCap = () => {
    const newValue = !formData.noGroupSizeCap;
    updateFormData({
      noGroupSizeCap: newValue,
      groupSize: newValue ? MAX_GROUP_SIZE : formData.groupSize,
    });
  };

  // Blocks the host from continuing until every Details field has something in it
  const canContinue =
    formData.hangoutType !== null &&
    formData.hangoutName.trim() !== "" &&
    formData.vibe.length > 0 &&
    formData.activities.length > 0;

  // console.log("Current activities:", formData.activities); //Debug
  return (
    <ScrollView style={detailsStepStyle.screen}>
      <View style={detailsStepStyle.intro}>
        <Lucide name="sparkles" size={12} color={COLORS.textPrimary} />
        <Text style={detailsStepStyle.introText}>
          {/* Replace with actual AI suggestion */}
          Based on your interests and who's free nearby, AI suggests: Art and
          sketching session — use this or start fresh?
        </Text>
      </View>

      <View style={detailsStepStyle.buttonContainer}>
        <Button
          title="Use AI suggestion"
          variant="fill"
          style={{
            flex: 1,
            paddingVertical: 10,
            alignSelf: "auto",
          }}
          textStyle={{
            fontSize: FONT_SIZE.sm,
          }}
        />

        <Button
          title="Start fresh"
          variant="outline"
          style={{
            flex: 1,
            paddingVertical: 10,
            alignSelf: "auto",
          }}
        />
      </View>

      <View style={detailsStepStyle.details}>
        {/* Hangout Type */}
        <View>
          <Text style={detailsStepStyle.sectionLabel}>Hangout type</Text>
          <View style={detailsStepStyle.chipRow}>
            {interests.map((interest) => (
              <Pressable
                key={interest.id}
                style={[
                  detailsStepStyle.chip,
                  formData.hangoutType === interest.id &&
                    detailsStepStyle.chipSelected,
                ]}
                onPress={() => selectInterest(interest.id)}
              >
                <Text
                  style={[
                    detailsStepStyle.chipLabel,
                    formData.hangoutType === interest.id &&
                      detailsStepStyle.chipLabelSelected,
                  ]}
                >
                  {interest.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Hangout Name */}
        <View>
          <Text style={detailsStepStyle.sectionLabel}>Hangout name</Text>
          <TextInput
            style={detailsStepStyle.textInput}
            value={formData.hangoutName}
            onChangeText={(text) => updateFormData({ hangoutName: text })}
            placeholder="Give your hangout a name"
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        {/* Vibe */}
        <View>
          <Text style={detailsStepStyle.sectionLabel}>Vibe</Text>
          <View style={detailsStepStyle.chipRow}>
            {vibes.map((vibe) => (
              <Pressable
                key={vibe.id}
                style={[
                  detailsStepStyle.chip,
                  formData.vibe.includes(vibe.id) &&
                    detailsStepStyle.chipSelected,
                ]}
                onPress={() => toggleVibe(vibe.id)}
              >
                <Text
                  style={[
                    detailsStepStyle.chipLabel,
                    formData.vibe.includes(vibe.id) &&
                      detailsStepStyle.chipLabelSelected,
                  ]}
                >
                  {vibe.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Group Size */}
        <View>
          <Text style={detailsStepStyle.sectionLabel}>
            Group size (Max people)
          </Text>
          <View style={detailsStepStyle.groupSizeOptions}>
            <View style={detailsStepStyle.groupSizeRow}>
              <Pressable
                disabled={formData.noGroupSizeCap}
                onPress={decrementGroupSize}
                style={detailsStepStyle.groupSizeButton}
              >
                <Lucide name="minus" size={18} color={COLORS.textPrimary} />
              </Pressable>

              <Text style={detailsStepStyle.groupSizeValue}>
                {formData.noGroupSizeCap ? "Large" : formData.groupSize}
              </Text>

              <Pressable
                disabled={formData.noGroupSizeCap}
                onPress={incrementGroupSize}
                style={detailsStepStyle.groupSizeButton}
              >
                <Lucide name="plus" size={18} color={COLORS.textPrimary} />
              </Pressable>
            </View>

            {/* No Limit marker */}
            <Pressable
              style={detailsStepStyle.checkboxRow}
              onPress={toggleNoCap}
            >
              <Lucide
                name={formData.noGroupSizeCap ? "check-square" : "square"}
                size={20}
                color={COLORS.textPrimary}
              />
              <Text style={detailsStepStyle.checkboxLabel}>Over 15 people</Text>
            </Pressable>
          </View>
          <Text style={detailsStepStyle.groupSizeSubtext}>
            Recommended: 6-12 for intimate hangouts
          </Text>
        </View>

        {/* Activities */}
        <View style={detailsStepStyle.activities}>
          <Text style={detailsStepStyle.sectionLabel}>Activities</Text>
          <TextInput
            style={detailsStepStyle.textInput}
            value={activityInput}
            onChangeText={setActivityInput}
            onSubmitEditing={addActivity}
            placeholder="e.g. Portrait challenge, street food after..."
            placeholderTextColor={COLORS.textSecondary}
            returnKeyType="done"
          />

          <View style={detailsStepStyle.chipRow}>
            {formData.activities.map((activity, index) => (
              <Pressable
                key={index}
                style={detailsStepStyle.activityChip}
                onPress={() => removeActivity(index)}
              >
                <Text style={detailsStepStyle.activityChipLabel}>
                  {activity}
                </Text>
                <Lucide name="x" size={14} color={COLORS.textPrimary} />
              </Pressable>
            ))}
          </View>
        </View>

        <View style={detailsStepStyle.nextButtonContainer}>
          <Button
            title="Next — Pick a date"
            variant="fill"
            onPress={onNext}
            disabled={!canContinue}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const detailsStepStyle = StyleSheet.create({
  screen: {
    paddingHorizontal: 10,
  },

  intro: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: COLORS.secondary,
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
  },

  introText: {
    fontSize: FONT_SIZE.sm,
  },

  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },

  details: {
    gap: 15,
    marginTop: 18,
  },

  sectionLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "600",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    marginBottom: 8,
  },

  textInput: {
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: COLORS.text,
  },

  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  chipLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
  },

  chipLabelSelected: {
    color: COLORS.background,
  },

  groupSizeOptions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginVertical: 5,
  },

  groupSizeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  groupSizeButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 50,
    padding: 5,
  },

  groupSizeValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 900,
    color: COLORS.textPrimary,
    width: 50,
    textAlign: "center",
  },

  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  checkboxLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
  },

  groupSizeSubtext: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },

  activities: {
    marginBottom: 20,
  },

  activityChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: COLORS.secondary,
  },

  activityChipLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
  },

  nextButtonContainer: {
    paddingVertical: 15,
    borderColor: COLORS.border,
    borderTopWidth: 1,
  },
});
