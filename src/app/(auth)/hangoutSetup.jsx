import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Button from "../../components/ui/button";
import { COLORS, FONT_SIZE } from "../../constants/brand";
import { useAuth } from "../../hooks/useAuth";
import { getSession } from "../../services/auth";
import { saveHangoutPreferences } from "../../services/profile";
import { globalStyles } from "../../styles/global";

export default function hangoutSetup() {
  const [setting, setSetting] = useState(null);
  const [energy, setEnergy] = useState(null);
  const [groupSize, setGroupSize] = useState(null);
  const [freeDays, setFreeDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { refreshProfile } = useAuth();

  const showError = (message) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage("");
    }, 4000);
  };

  // Adds or removes a day from the selected free days when tapped
  const toggleFreeDay = (day) => {
    setFreeDays((current) =>
      current.includes(day)
        ? current.filter((d) => d !== day)
        : [...current, day],
    );
  };

  const handleSubmit = async () => {
    // If any choice field is missing, show an error
    if (!setting || !energy || !groupSize) {
      showError("Please make a selection for each option.");
      return;
    }

    // If no free day is selected show an error
    if (freeDays.length === 0) {
      showError("Please select at least one day you're usually free.");
      return;
    }

    setLoading(true);

    const { session, error: sessionError } = await getSession();

    // If there is no session, stop and show an error
    if (sessionError || !session) {
      showError("You must be logged in to continue.");
      setLoading(false);
      return;
    }

    const { profile, error } = await saveHangoutPreferences(session.user.id, {
      setting,
      energy,
      group_size: groupSize,
      free_days: freeDays,
      onboarding_completed: true,
    });

    setLoading(false);

    // If saving failed, show the error
    if (error) {
      showError(error);
      return;
    }

    // Refresh local profile state so route guard sees onboarding_completed as true
    await refreshProfile();

    router.replace("/(auth)/notificationSetup");
  };

  // Arrays
  const SETTING_OPTIONS = ["Indoors", "Outdoors", "Both"];
  const ENERGY_OPTIONS = ["Chill", "Active", "Either"];
  const GROUP_SIZE_OPTIONS = [
    { value: "Small", label: "3-8" },
    { value: "Medium", label: "8-15" },
    { value: "Open", label: "any" },
  ];
  const DAY_OPTIONS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <View style={globalStyles.screen}>
      {errorMessage && <Text style={globalStyles.error}>{errorMessage}</Text>}
      <Text style={globalStyles.introText}>Your hangout style</Text>
      <Text style={globalStyles.subText}>
        Helps AI avoid suggesting things that don't suit you.
      </Text>

      <View style={hangoutSetupStyle.hangoutContainer}>
        {/* SETTING */}
        <View>
          <Text style={hangoutSetupStyle.sectionTitle}>Setting</Text>
          <View style={hangoutSetupStyle.chipContainer}>
            {SETTING_OPTIONS.map((option) => {
              const isSelected = setting === option;

              return (
                <Pressable
                  key={option}
                  onPress={() => setSetting(option)}
                  style={[
                    hangoutSetupStyle.chip,
                    isSelected && hangoutSetupStyle.chipSelected,
                  ]}
                >
                  <Text
                    style={[
                      hangoutSetupStyle.chipText,
                      isSelected && hangoutSetupStyle.chipTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ENERGY */}
        <View>
          <Text style={hangoutSetupStyle.sectionTitle}>ENERGY</Text>
          <View style={hangoutSetupStyle.chipContainer}>
            {ENERGY_OPTIONS.map((option) => {
              const isSelected = energy === option;

              return (
                <Pressable
                  key={option}
                  onPress={() => setEnergy(option)}
                  style={[
                    hangoutSetupStyle.chip,
                    isSelected && hangoutSetupStyle.chipSelected,
                  ]}
                >
                  <Text
                    style={[
                      hangoutSetupStyle.chipText,
                      isSelected && hangoutSetupStyle.chipTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* GROUP SIZE */}
        <View>
          <Text style={hangoutSetupStyle.sectionTitle}>Group size</Text>
          <View style={hangoutSetupStyle.chipContainer}>
            {GROUP_SIZE_OPTIONS.map((option) => {
              const isSelected = groupSize === option.value;

              return (
                <Pressable
                  key={option.value}
                  onPress={() => setGroupSize(option.value)}
                  style={[
                    hangoutSetupStyle.chip,
                    isSelected && hangoutSetupStyle.chipSelected,
                  ]}
                >
                  <Text
                    style={[
                      hangoutSetupStyle.chipText,
                      isSelected && hangoutSetupStyle.chipTextSelected,
                    ]}
                  >
                    {option.value}
                  </Text>

                  <Text
                    style={[
                      hangoutSetupStyle.chipSubText,
                      isSelected && hangoutSetupStyle.chipTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* FREE DAYS */}
        <View>
          <Text style={hangoutSetupStyle.sectionTitle}>
            WHEN I'M USUALLY FREE
          </Text>
          <View style={hangoutSetupStyle.chipContainer}>
            {DAY_OPTIONS.map((day) => {
              const isSelected = freeDays.includes(day);

              return (
                <View key={day} style={hangoutSetupStyle.dayView}>
                  <Text style={[hangoutSetupStyle.chipText]}>{day}</Text>

                  <Pressable
                    onPress={() => toggleFreeDay(day)}
                    style={[
                      hangoutSetupStyle.circle,
                      isSelected && hangoutSetupStyle.circleSelected,
                    ]}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </View>

      <Button
        title={
          loading ? <ActivityIndicator color={COLORS.white} /> : "ALmost there"
        }
        variant="fill"
        disabled={!setting || !energy || !groupSize || freeDays.length === 0}
        onPress={handleSubmit}
      />
    </View>
  );
}

const hangoutSetupStyle = StyleSheet.create({
  hangoutContainer: {
    marginBottom: 20,
    marginTop: 20,
  },

  sectionTitle: {
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 10,
  },

  chipContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 8,
  },
  chip: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  chipSelected: {
    backgroundColor: COLORS.secondary,
  },
  chipText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    fontWeight: 600,
    textAlign: "center",
    textTransform: "capitalize",
  },

  chipSubText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    textAlign: "center",
  },

  chipTextSelected: {
    color: COLORS.textPrimary,
  },

  dayView: {
    flexDirection: "column",
    alignItems: "center",
    gap: 5,
  },

  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },

  circleSelected: {
    backgroundColor: COLORS.primary,
  },
});
