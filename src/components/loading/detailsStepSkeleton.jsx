import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { COLORS } from "../../constants/brand";

export default function DetailsStepSkeleton() {
  // Renders pulsing gray placeholder blocks while the host's interests and vibes list are loading
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );

    pulse.start();

    // If the component unmounts, stop the animation
    return () => pulse.stop();
  }, []);

  return (
    <View style={detailsStepSkeletonStyle.container}>
      {/* Hangout name input placeholder */}
      <Animated.View
        style={[detailsStepSkeletonStyle.skeletonLabel, { opacity: pulseAnim }]}
      />
      <Animated.View
        style={[detailsStepSkeletonStyle.skeletonInput, { opacity: pulseAnim }]}
      />

      {/* Hangout type chip row placeholder */}
      <Animated.View
        style={[detailsStepSkeletonStyle.skeletonLabel, { opacity: pulseAnim }]}
      />
      <View style={detailsStepSkeletonStyle.chipRow}>
        {[1, 2, 3, 4].map((chip) => (
          <Animated.View
            key={chip}
            style={[
              detailsStepSkeletonStyle.skeletonChip,
              { opacity: pulseAnim },
            ]}
          />
        ))}
      </View>

      {/* Vibe chip row placeholder */}
      <Animated.View
        style={[detailsStepSkeletonStyle.skeletonLabel, { opacity: pulseAnim }]}
      />
      <View style={detailsStepSkeletonStyle.chipRow}>
        {[1, 2, 3, 4, 5].map((chip) => (
          <Animated.View
            key={chip}
            style={[
              detailsStepSkeletonStyle.skeletonChip,
              { opacity: pulseAnim },
            ]}
          />
        ))}
      </View>

      {/* Group size stepper placeholder */}
      <Animated.View
        style={[detailsStepSkeletonStyle.skeletonLabel, { opacity: pulseAnim }]}
      />
      <Animated.View
        style={[
          detailsStepSkeletonStyle.skeletonStepper,
          { opacity: pulseAnim },
        ]}
      />

      {/* Activities input placeholder */}
      <Animated.View
        style={[detailsStepSkeletonStyle.skeletonLabel, { opacity: pulseAnim }]}
      />
      <Animated.View
        style={[detailsStepSkeletonStyle.skeletonInput, { opacity: pulseAnim }]}
      />
    </View>
  );
}

const detailsStepSkeletonStyle = StyleSheet.create({
  container: {
    padding: 20,
  },
  skeletonLabel: {
    width: 100,
    height: 16,
    borderRadius: 4,
    backgroundColor: COLORS.surface,
    marginTop: 20,
    marginBottom: 10,
  },
  skeletonInput: {
    width: "100%",
    height: 44,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skeletonChip: {
    width: 70,
    height: 32,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
  },
  skeletonStepper: {
    width: 140,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
  },
});
