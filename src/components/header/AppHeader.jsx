// The Main Header component that appears at the top of every screen.

import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, FONT_SIZE } from "../../constants/brand";
import { useAuthContext } from "../../context/AuthContext";
import { useSidebar } from "../../context/SidebarContext";
import { getNameParts } from "../../utils/name";

export default function AppHeader({ options }) {
  // Top inset keeps the header below the status bar and notch on iOS and Android
  const insets = useSafeAreaInsets();
  const { profile } = useAuthContext();
  const { openSidebar } = useSidebar();

  // Flips to true if the profile photo fails to load so we can fall back to initials
  const [imageFailed, setImageFailed] = useState(false);

  const { firstName, initials } = getNameParts(profile?.display_name);
  const photoUrl = profile?.avatar_url;
  const showPhoto = Boolean(photoUrl) && !imageFailed;

  // Screen title and right-side content come from each screen's own options
  const title =
    typeof options.headerTitle === "string" ? options.headerTitle : null;
  const rightContent = options.headerRight
    ? options.headerRight({ tintColor: COLORS.textSecondary, canGoBack: false })
    : null;

  // Give the photo another chance whenever the URL changes
  useEffect(() => {
    setImageFailed(false);
  }, [photoUrl]);

  // Set the sidebar state to open when the avatar group is pressed
  const handleAvatarPress = () => {
    console.log("Header avatar pressed, opening sidebar");
    openSidebar();
  };

  return (
    <View style={[AppHeaderStyle.container, { paddingTop: insets.top }]}>
      <View style={AppHeaderStyle.row}>
        <View style={AppHeaderStyle.left}>
          <Pressable
            onPress={handleAvatarPress}
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            accessibilityHint="Opens the side menu"
            hitSlop={8}
            style={({ pressed }) => [
              AppHeaderStyle.avatarGroup,
              pressed && AppHeaderStyle.pressed,
            ]}
          >
            <View style={AppHeaderStyle.avatar}>
              {showPhoto ? (
                <Image
                  source={{ uri: photoUrl }}
                  style={AppHeaderStyle.avatarImage}
                  onError={() => setImageFailed(true)}
                  accessible={false}
                />
              ) : (
                <Text
                  style={AppHeaderStyle.initials}
                  maxFontSizeMultiplier={1.3}
                >
                  {initials}
                </Text>
              )}
            </View>
            {/* Name shrinks and truncates when the title needs the space */}
            <Text
              style={AppHeaderStyle.name}
              numberOfLines={1}
              maxFontSizeMultiplier={1.3}
            >
              {firstName}
            </Text>
          </Pressable>
        </View>

        {/* Title only renders on screens that set one */}
        {title ? (
          <View style={AppHeaderStyle.center}>
            <Text
              accessibilityRole="header"
              style={AppHeaderStyle.title}
              numberOfLines={1}
              maxFontSizeMultiplier={1.3}
            >
              {title}
            </Text>
          </View>
        ) : null}

        {/* Equal-width sides keep the title centered; without a title the right side stays compact */}
        <View
          style={title ? AppHeaderStyle.rightWithTitle : AppHeaderStyle.right}
        >
          {rightContent}
        </View>
      </View>
    </View>
  );
}

const AppHeaderStyle = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    // Shadow for iOS
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    // Shadow for Android
    elevation: 4,
  },
  row: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  left: {
    flex: 1,
    flexDirection: "row",
  },
  // 48 high keeps the touch target accessible
  avatarGroup: {
    flexShrink: 1,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 48,
  },
  pressed: {
    opacity: 0.6,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  initials: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  name: {
    flexShrink: 1,
    marginLeft: 12,
    fontSize: FONT_SIZE.md,
    fontWeight: "500",
    color: COLORS.text,
  },
  center: {
    flexShrink: 1,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "600",
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightWithTitle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});
