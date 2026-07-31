import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { COLORS } from "../../constants/brand";

export default function InterestSkeleton() {
  // Renders a set of pulsing gray placeholder blocks while interests are loading
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
    <View>
      {[1, 2, 3, 4, 5].map((section) => (
        <View key={section} style={interestsSkeletonStyle.categorySection}>
          <Animated.View
            style={[
              interestsSkeletonStyle.skeletonTitle,
              { opacity: pulseAnim },
            ]}
          />

          <View style={interestsSkeletonStyle.chipContainer}>
            {[1, 2, 3, 4, 5, 6].map((chip) => (
              <Animated.View
                key={chip}
                style={[
                  interestsSkeletonStyle.skeletonChip,
                  { opacity: pulseAnim },
                ]}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

const interestsSkeletonStyle = StyleSheet.create({
  skeletonTitle: {
    width: 120,
    height: 20,
    borderRadius: 4,
    backgroundColor: COLORS.surface,
    marginBottom: 12,
  },

  chipContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    marginBottom: 15,
  },

  skeletonChip: {
    width: 60,
    height: 26,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
  },
});
