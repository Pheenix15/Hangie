import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import InterestSkeleton from "../../components/loading/interestSkeleton";
import Button from "../../components/ui/button";
import { COLORS, FONT_SIZE } from "../../constants/brand";
import { getSession } from "../../services/auth";
import {
  getInterestsByCategory,
  saveUserInterests,
} from "../../services/interests";
import { globalStyles } from "../../styles/global";

export default function interests() {
  const [categories, setCategories] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingInterests, setLoadingInterests] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Loads all available interests, grouped by category, when the screen first opens
  useEffect(() => {
    loadInterests();
  }, []);

  const loadInterests = async () => {
    setLoadingInterests(true);
    const { categories, error } = await getInterestsByCategory();
    if (error) {
      setErrorMessage(error);

      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
      return;
    }

    setCategories(categories);
    setLoadingInterests(false);
  };

  // Adds or removes an interest from the selected list when tapped
  const toggleInterest = (interestId) => {
    setSelectedIds((current) =>
      current.includes(interestId)
        ? current.filter((id) => id !== interestId)
        : [...current, interestId],
    );
  };

  const handleSubmit = async () => {
    // At least 3 interests must be picked before continuing
    if (selectedIds.length < 3) {
      setErrorMessage("Please select at least 3 interests.");

      setTimeout(() => {
        setErrorMessage("");
      }, 4000);

      return;
    }

    setLoading(true);

    const { session, error: sessionError } = await getSession();

    if (sessionError || !session) {
      setErrorMessage("You must be logged in to continue.");

      setTimeout(() => {
        setErrorMessage("");
      }, 4000);

      setLoading(false);
      return;
    }

    const { error } = await saveUserInterests(session.user.id, selectedIds);

    setLoading(false);

    if (error) {
      setErrorMessage(error);
      return;
    }

    router.replace("/(tabs)/feeds");
  };

  return (
    <View style={globalStyles.screen}>
      <View style={interestsSetupStyle.introContainer}>
        <Text style={interestsSetupStyle.introText}>What are you into?</Text>
        <Text style={interestsSetupStyle.subText}>
          Pick at least 3. The AI uses this to find your people
        </Text>
      </View>

      <View>
        <Text style={interestsSetupStyle.counter}>
          {`${selectedIds.length} selected — pick at least 3`}
        </Text>
      </View>

      {/* INTERESTS SELECTION */}
      <View style={interestsSetupStyle.interestsContainer}>
        {loadingInterests ? (
          <InterestSkeleton />
        ) : (
          categories.map((categoryGroup) => (
            <View
              key={categoryGroup.category}
              style={interestsSetupStyle.categorySection}
            >
              <Text style={interestsSetupStyle.categoryTitle}>
                {categoryGroup.category}
              </Text>

              <View style={interestsSetupStyle.chipContainer}>
                {categoryGroup.interests.map((interest) => {
                  const isSelected = selectedIds.includes(interest.id);

                  return (
                    <Pressable
                      key={interest.id}
                      onPress={() => toggleInterest(interest.id)}
                      style={[
                        interestsSetupStyle.chip,
                        isSelected && interestsSetupStyle.chipSelected,
                      ]}
                    >
                      <Text
                        style={[
                          interestsSetupStyle.chipText,
                          isSelected && interestsSetupStyle.chipTextSelected,
                        ]}
                      >
                        {interest.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))
        )}
      </View>

      <View>
        <Button
          title={
            loading ? <ActivityIndicator color={COLORS.white} /> : "Continue"
          }
          variant="fill"
          disabled={selectedIds.length < 3}
          onPress={() => router.replace("/(auth)/hangoutSetup")}
        />
      </View>
    </View>
  );
}

const interestsSetupStyle = StyleSheet.create({
  introContainer: {
    gap: 10,
  },

  introText: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: 600,
  },

  subText: {
    fontSize: FONT_SIZE.md,
    fontWeight: 500,
    color: COLORS.textSecondary,
  },

  counter: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: 500,
    marginTop: 20,
    marginBottom: 20,
  },

  interestsContainer: {},

  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
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
    textTransform: "capitalize",
  },
  chipTextSelected: {
    color: COLORS.textPrimary,
  },
});
