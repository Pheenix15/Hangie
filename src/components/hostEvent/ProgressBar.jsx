import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZE } from "../../constants/brand";

const STEP_LABELS = ["Details", "When", "Where", "Who", "Review"];

export default function ProgressBar({ currentStep, onStepPress }) {
  return (
    <View style={progressBarStyles.container}>
      {/* Progress bar fills 20% per completed step, 100% wide once on Review */}
      <View style={progressBarStyles.track}>
        <View
          style={[
            progressBarStyles.fill,
            { width: `${((currentStep + 1) / STEP_LABELS.length) * 100}%` },
          ]}
        />
      </View>

      <View style={progressBarStyles.labelRow}>
        {STEP_LABELS.map((label, index) => {
          // A step is only tappable if the host has already reached it, so they can't skip ahead
          const isReachable = index <= currentStep;
          const isActive = index === currentStep;

          return (
            <Pressable
              key={label}
              disabled={!isReachable}
              onPress={() => onStepPress(index)}
              style={progressBarStyles.labelPressable}
            >
              <Text
                style={[
                  progressBarStyles.label,
                  isActive && progressBarStyles.labelActive,
                  !isReachable && progressBarStyles.labelDisabled,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const progressBarStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingTop: 12,
    paddingBottom: 8,
  },

  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    overflow: "hidden",
  },

  fill: {
    height: "100%",
    backgroundColor: COLORS.primary,
  },

  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    marginTop: 10,
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    borderColor: COLORS.border,
  },

  labelPressable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },

  label: {
    fontSize: FONT_SIZE.xs,
    fontWeight: 500,
    color: COLORS.textSecondary,
  },

  labelActive: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  labelDisabled: {
    color: COLORS.border,
  },
});
