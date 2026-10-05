// components/hostEvent/WhenStep.jsx

import DateTimePicker from "@react-native-community/datetimepicker";
import Lucide from "@react-native-vector-icons/lucide";
import { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { COLORS } from "../../constants/brand";
import Button from "../ui/button";

// Placeholder AI match data until the real recommender is built, date -> how many matches are free that day
const STUB_SUGGESTED_DATES = {
  "2026-06-21": 3,
  "2026-06-27": 4,
  "2026-06-28": 6,
};

export default function WhenStep({ formData, updateFormData, onNext, onBack }) {
  const [activePicker, setActivePicker] = useState(null);

  // Today's date in YYYY-MM-DD, used to block today and every date before it
  const today = new Date().toISOString().split("T")[0];

  // Finds the suggested date with the highest match count, for the banner's headline
  const bestSuggestedDate = Object.entries(STUB_SUGGESTED_DATES).sort(
    (a, b) => b[1] - a[1],
  )[0];

  const selectDate = (day) => {
    updateFormData({ eventDate: day.dateString });
  };

  const handleTimeChange = (event, selectedTime) => {
    if (Platform.OS === "android") {
      setActivePicker(null);
    }

    if (!selectedTime) return;

    if (activePicker === "start") {
      updateFormData({ startTime: selectedTime });
    } else if (activePicker === "end") {
      updateFormData({ endTime: selectedTime });
    }
  };

  const formatTime = (time) => {
    if (!time) return "Select time";
    return time.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  // Formats a raw date string like "2026-06-28" into "Saturday 28 Jun" for the banner
  const formatBannerDate = (dateString) => {
    const date = new Date(dateString);
    const weekday = date.toLocaleDateString([], { weekday: "long" });
    const day = date.getDate();
    const month = date.toLocaleDateString([], { month: "short" });
    return `${weekday} ${day} ${month}`;
  };

  // Renders a single day cell, handling the disabled, selected, and AI-suggested states
  const renderDay = ({ date, state }) => {
    const isDisabled = state === "disabled";
    const isSelected = formData.eventDate === date.dateString;
    const matchCount = STUB_SUGGESTED_DATES[date.dateString];
    const isSuggested = Boolean(matchCount) && !isSelected;

    return (
      <Pressable
        disabled={isDisabled}
        onPress={() => selectDate(date)}
        style={[
          whenStepStyle.dayCell,
          isSuggested && whenStepStyle.dayCellSuggested,
          isSelected && whenStepStyle.dayCellSelected,
        ]}
      >
        <Text
          style={[
            whenStepStyle.dayText,
            isDisabled && whenStepStyle.dayTextDisabled,
            isSelected && whenStepStyle.dayTextSelected,
          ]}
        >
          {date.day}
        </Text>

        {isSuggested && <View style={whenStepStyle.suggestedDot} />}
      </Pressable>
    );
  };

  const canContinue =
    formData.eventDate !== null &&
    formData.startTime !== null &&
    formData.endTime !== null;

  return (
    <ScrollView style={whenStepStyle.screen}>
      {/* AI Banner (Temporary replace with actual banner when AI is added) */}
      <View style={whenStepStyle.banner}>
        <Lucide name="sparkles" size={18} color={COLORS.primary} />
        <Text style={whenStepStyle.bannerText}>
          <Text style={whenStepStyle.bannerBold}>
            AI found the sweet spot:{" "}
          </Text>
          {formatBannerDate(bestSuggestedDate[0])} — {bestSuggestedDate[1]} of
          your matches are free. Highlighted in green below.
        </Text>
      </View>

      <Calendar
        minDate={today}
        dayComponent={renderDay}
        theme={{
          arrowColor: COLORS.textPrimary,
          textSectionTitleColor: COLORS.textSecondary,
        }}
      />

      {/* Green and Purple Legend */}
      <View style={whenStepStyle.legendRow}>
        <View style={whenStepStyle.legendItem}>
          <View
            style={[
              whenStepStyle.legendDot,
              { backgroundColor: COLORS.success },
            ]}
          />
          <Text style={whenStepStyle.legendLabel}>Most matches free</Text>
        </View>

        <View style={whenStepStyle.legendItem}>
          <View
            style={[
              whenStepStyle.legendDot,
              { backgroundColor: COLORS.primary },
            ]}
          />
          <Text style={whenStepStyle.legendLabel}>Selected</Text>
        </View>
      </View>

      <View style={whenStepStyle.timeSection}>
        {/* Start Time */}
        <View style={{ flex: 1 }}>
          <Text style={whenStepStyle.sectionLabel}>Start time</Text>
          <Pressable
            style={whenStepStyle.timeButton}
            onPress={() => setActivePicker("start")}
          >
            <Text style={whenStepStyle.timeButtonLabel}>
              {formatTime(formData.startTime)}
            </Text>
          </Pressable>
        </View>

        {/* End Time */}
        <View style={{ flex: 1 }}>
          <Text style={whenStepStyle.sectionLabel}>End time</Text>
          <Pressable
            style={whenStepStyle.timeButton}
            onPress={() => setActivePicker("end")}
          >
            <Text style={whenStepStyle.timeButtonLabel}>
              {formatTime(formData.endTime)}
            </Text>
          </Pressable>
        </View>
      </View>

      {activePicker && (
        <DateTimePicker
          value={
            (activePicker === "start"
              ? formData.startTime
              : formData.endTime) || new Date()
          }
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleTimeChange}
        />
      )}

      {Platform.OS === "ios" && activePicker && (
        <Pressable
          style={whenStepStyle.doneButton}
          onPress={() => setActivePicker(null)}
        >
          <Text style={whenStepStyle.doneButtonLabel}>Done</Text>
        </Pressable>
      )}

      <View style={whenStepStyle.nextButtonContainer}>
        <Button
          icon={
            <Lucide name="arrow-left" size={15} color={COLORS.textPrimary} />
          }
          variant="outline"
          onPress={onBack}
        />

        <Button
          title="Next — Choose venue"
          icon={<Lucide name="arrow-right" size={15} color={COLORS.white} />}
          variant="fill"
          onPress={onNext}
          disabled={!canContinue}
          style={{
            flexDirection: "row-reverse",
            justifyContent: "center",
            flex: 1,
          }}
        />
      </View>
    </ScrollView>
  );
}

const whenStepStyle = StyleSheet.create({
  screen: {
    paddingHorizontal: 10,
  },
  sectionLabel: {
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginTop: 20,
    marginBottom: 8,
  },
  banner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  bannerText: {
    flex: 1,
    color: COLORS.textPrimary,
  },
  bannerBold: {
    fontWeight: "700",
  },
  dayCell: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCellSuggested: {
    backgroundColor: COLORS.successLight,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  dayCellSelected: {
    backgroundColor: COLORS.primary,
  },
  dayText: {
    color: COLORS.textPrimary,
  },
  dayTextDisabled: {
    color: COLORS.border,
  },
  dayTextSelected: {
    color: COLORS.background,
  },
  suggestedDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.success,
    marginTop: 2,
  },
  legendRow: {
    flexDirection: "row",
    gap: 20,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    color: COLORS.textSecondary,
  },
  timeSection: {
    flexDirection: "row",
    gap: 20,
    marginTop: 20,
  },
  timeButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  timeButtonLabel: {
    color: COLORS.textPrimary,
  },
  doneButton: {
    alignSelf: "flex-end",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  doneButtonLabel: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  nextButtonContainer: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    borderTopWidth: 2,
    borderTopColor: COLORS.border,
    marginTop: 15,
    paddingVertical: 10,
  },
  backButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  backButtonLabel: {
    color: COLORS.textPrimary,
  },
});
