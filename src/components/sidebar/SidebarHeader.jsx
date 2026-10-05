import Lucide from "@react-native-vector-icons/lucide";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, FONT_SIZE } from "../../constants/brand";
import { SIDEBAR_STATS } from "../../constants/sidebar";
import { getNameParts } from "../../utils/name";

export default function SidebarHeader({ profile, stats, onEditPress }) {
  // Top inset keeps the banner below the status bar and notch on iOS and Android
  const insets = useSafeAreaInsets();

  // Flips to true if the photo fails to load so we can fall back to initials
  const [imageFailed, setImageFailed] = useState(false);

  const { firstName, lastInitial, initials } = getNameParts(
    profile?.display_name,
  );
  const shortName = lastInitial ? `${firstName} ${lastInitial}.` : firstName;
  const photoUrl = profile?.avatar_url;
  const showPhoto = Boolean(photoUrl) && !imageFailed;

  // Build the "@username · neighborhood" line from whatever the profile has
  const subline = [
    profile?.username ? `@${profile.username}` : null,
    profile?.neighborhood,
  ]
    .filter(Boolean)
    .join(" · ");

  // Give the photo another chance whenever the URL changes
  useEffect(() => {
    setImageFailed(false);
  }, [photoUrl]);

  return (
    <View
      style={[SidebarHeaderStyle.container, { paddingTop: insets.top + 16 }]}
    >
      {/* Placeholder until the brand banner or logo is ready */}
      <View style={SidebarHeaderStyle.banner} />

      <View style={SidebarHeaderStyle.identityRow}>
        <View style={SidebarHeaderStyle.avatar}>
          {showPhoto ? (
            <Image
              source={{ uri: photoUrl }}
              style={SidebarHeaderStyle.avatarImage}
              onError={() => setImageFailed(true)}
              accessibilityLabel="Your profile photo"
            />
          ) : (
            <Text
              style={SidebarHeaderStyle.initials}
              maxFontSizeMultiplier={1.3}
            >
              {initials}
            </Text>
          )}
        </View>

        <View style={SidebarHeaderStyle.identityText}>
          <Text
            style={SidebarHeaderStyle.name}
            numberOfLines={1}
            maxFontSizeMultiplier={1.3}
          >
            {shortName}
          </Text>
          {subline ? (
            <Text
              style={SidebarHeaderStyle.subline}
              numberOfLines={1}
              maxFontSizeMultiplier={1.3}
            >
              {subline}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={SidebarHeaderStyle.statsRow}>
        {SIDEBAR_STATS.map((stat) => {
          const count = stats[stat.key];
          // Use the singular label when the count is exactly 1
          const label = count === 1 ? stat.singular : stat.plural;

          return (
            <View
              key={stat.key}
              accessible={true}
              accessibilityLabel={`${count} ${label}`}
              style={SidebarHeaderStyle.stat}
            >
              <Text
                style={SidebarHeaderStyle.statCount}
                maxFontSizeMultiplier={1.3}
              >
                {count}
              </Text>
              <Text
                style={SidebarHeaderStyle.statLabel}
                maxFontSizeMultiplier={1.3}
              >
                {label}
              </Text>
            </View>
          );
        })}
      </View>

      <Pressable
        onPress={onEditPress}
        accessibilityRole="button"
        accessibilityLabel="Edit profile"
        style={({ pressed }) => [
          SidebarHeaderStyle.editButton,
          pressed && SidebarHeaderStyle.pressed,
        ]}
      >
        <Lucide name="pencil" size={16} color={COLORS.textSecondary} />
        <Text style={SidebarHeaderStyle.editText} maxFontSizeMultiplier={1.3}>
          Edit profile
        </Text>
      </Pressable>
    </View>
  );
}

const SidebarHeaderStyle = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  banner: {
    height: 72,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
  },
  identityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.secondary,
    borderWidth: 3,
    borderColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  initials: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  identityText: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.text,
  },
  subline: {
    marginTop: 2,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 16,
  },
  stat: {
    flexDirection: "row",
    alignItems: "baseline",
    marginRight: 18,
  },
  statCount: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.text,
  },
  statLabel: {
    marginLeft: 5,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  // 44 high keeps the touch target accessible
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pressed: {
    backgroundColor: COLORS.surface,
  },
  editText: {
    marginLeft: 8,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
});
