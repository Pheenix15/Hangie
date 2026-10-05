import Lucide from "@react-native-vector-icons/lucide";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import DetailsStep from "../../components/hostEvent/DetailsStep";
import ProgressBar from "../../components/hostEvent/ProgressBar";
import ReviewStep from "../../components/hostEvent/ReviewStep";
import WhenStep from "../../components/hostEvent/WhenStep";
import WhereStep from "../../components/hostEvent/WhereStep";
import WhoStep from "../../components/hostEvent/WhoStep";
import { COLORS, FONT_SIZE } from "../../constants/brand";
import { MIN_GROUP_SIZE } from "../../constants/hangout";
import { globalStyles } from "../../styles/global";

const STEPS = [DetailsStep, WhenStep, WhereStep, WhoStep, ReviewStep];

export default function HostEvent() {
  // Tracks which sub-screen is currently showing, 0 through 4
  const [step, setStep] = useState(0);

  // Holds every field across all 5 sub-screens until the host publishes
  const [formData, setFormData] = useState({
    hangoutType: null,
    hangoutName: "",
    vibe: [],
    groupSize: MIN_GROUP_SIZE,
    activities: [],
    startTime: null,
    endTime: null,
    // when, where, who fields added as those steps are defined
  });

  // Merges new values into formData without wiping out fields from other steps
  const updateFormData = (updates) => {
    setFormData((previous) => ({ ...previous, ...updates }));
  };

  // Move to the next sub-screen
  const goNext = () => setStep((previous) => previous + 1);

  // Move to the previous sub-screen
  const goBack = () => setStep((previous) => previous - 1);

  // Jumps directly to a specific step, used when a host taps a step label they've already reached
  const goToStep = (index) => setStep(index);

  const CurrentStep = STEPS[step];

  return (
    <View style={globalStyles.screen}>
      <View style={hostEventStyles.header}>
        <View style={hostEventStyles.headerIntro}>
          <View style={hostEventStyles.headerIntroLeft}>
            <Pressable
              style={hostEventStyles.backArrow}
              onPress={() => router.back()}
            >
              <Lucide name="arrow-left" size={15} color={COLORS.black} />
            </Pressable>

            <Text style={hostEventStyles.introText}>Schedule a hangout</Text>
          </View>

          <Pressable style={globalStyles.aiAssist}>
            <Lucide name="sparkles" size={10} color={COLORS.textPrimary} />
            <Text style={globalStyles.aiAssistText}>AI assist</Text>
          </Pressable>
        </View>

        {/* Progress Bar */}
        <ProgressBar currentStep={step} onStepPress={goToStep} />
      </View>

      {/*  */}
      <CurrentStep
        formData={formData}
        updateFormData={updateFormData}
        onNext={goNext}
        onBack={goBack}
      />
    </View>
  );
}

const hostEventStyles = StyleSheet.create({
  introText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 600,
  },

  headerIntro: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  headerIntroLeft: {
    flexDirection: "row",
    gap: 12,
  },

  backArrow: {
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    borderWidth: 0.5,
    borderRadius: 15,
    borderColor: COLORS.border,
  },
});
