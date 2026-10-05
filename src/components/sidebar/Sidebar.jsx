import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Alert,
  Animated,
  BackHandler,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, FONT_SIZE } from "../../constants/brand";
import { SIDEBAR_ROUTES, SIDEBAR_SECTIONS } from "../../constants/sidebar";
import { useAuthContext } from "../../context/AuthContext";
import { useSidebar } from "../../context/SidebarContext";
import { useProfileStats } from "../../hooks/useProfileStats";
import { signOut } from "../../services/auth";
import SidebarHeader from "./SidebarHeader";
import SidebarMenuItem from "./SidebarMenuItem";

export default function Sidebar() {
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const { session, profile } = useAuthContext();
  const { stats } = useProfileStats(session?.user?.id, isSidebarOpen);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Sidebar takes about 78% of the screen, capped so it doesn't get huge on tablets
  const sidebarWidth = Math.min(width * 0.78, 340);

  // Kept in a ref so the swipe handler always reads the latest width
  const sidebarWidthRef = useRef(sidebarWidth);
  sidebarWidthRef.current = sidebarWidth;

  // Stays mounted while open or animating so it can slide out before disappearing
  const [isMounted, setIsMounted] = useState(false);

  // 0 is fully closed, 1 is fully open. Drives both the slide and the backdrop fade
  const progress = useRef(new Animated.Value(0)).current;

  // When true, the next close skips the slide-out animation
  const skipCloseAnimation = useRef(false);

  // Mirrors the phone's reduce motion setting
  const reduceMotion = useRef(false);

  // Moves the sidebar to open (1) or closed (0), instantly if the user prefers reduced motion
  const animateTo = (toValue, duration, onDone) => {
    Animated.timing(progress, {
      toValue,
      duration: reduceMotion.current ? 0 : duration,
      useNativeDriver: true,
    }).start(onDone);
  };

  // Close with no animation so the user just sees the new screen with the sidebar already gone
  const closeInstantly = () => {
    skipCloseAnimation.current = true;
    closeSidebar();
  };

  // Close the sidebar, then go to the screen. Items without a route yet do nothing
  const handleNavigate = (route) => {
    if (!route) {
      console.log("Sidebar item has no route yet");
      return;
    }

    closeInstantly();
    router.navigate(route);
  };

  // Log the user out. The route guard sends them to welcome once the session is gone
  const confirmLogout = async () => {
    closeInstantly();
    const { error } = await signOut();
    console.log("Sign out result:", error);

    if (error) {
      Alert.alert("Could not log out", error);
    }
  };

  // Ask first, so a stray tap doesn't log the user out
  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: confirmLogout },
    ]);
  };

  // Small badge text for items that have one, like "0 groups" on Communities
  const getBadge = (item) => {
    if (item.id !== "communities") return null;
    return `${stats.communities} ${stats.communities === 1 ? "group" : "groups"}`;
  };

  // Sidebar Close by Swiping
  const panResponder = useRef(
    PanResponder.create({
      // Only take over when the finger is clearly moving left, so vertical scrolling still works
      onMoveShouldSetPanResponder: (_, gesture) =>
        gesture.dx < -10 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
      // Follow the finger by moving progress from 1 toward 0
      onPanResponderMove: (_, gesture) => {
        progress.setValue(
          Math.max(0, Math.min(1, 1 + gesture.dx / sidebarWidthRef.current)),
        );
      },
      // Close if swiped far enough or fast enough, otherwise spring back open
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx < -sidebarWidthRef.current * 0.3 || gesture.vx < -0.5) {
          closeSidebar();
        } else {
          animateTo(1, 150);
        }
      },
      // If something interrupts the swipe, settle back to open
      onPanResponderTerminate: () => {
        animateTo(1, 150);
      },
    }),
  ).current;

  // Keep the reduce motion setting up to date
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      reduceMotion.current = enabled;
    });

    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      (enabled) => {
        reduceMotion.current = enabled;
      },
    );

    return () => subscription.remove();
  }, []);

  // Opens The Sidebar
  useEffect(() => {
    if (isSidebarOpen) {
      setIsMounted(true);
    }
  }, [isSidebarOpen]);

  // Slide in once mounted and open, slide out when closed
  useEffect(() => {
    if (!isMounted) return;

    if (isSidebarOpen) {
      animateTo(1, 250);
      AccessibilityInfo.announceForAccessibility("Menu opened");
      return;
    }

    // A menu item was tapped, so snap shut instead of animating
    if (skipCloseAnimation.current) {
      skipCloseAnimation.current = false;
      progress.setValue(0);
      setIsMounted(false);
      return;
    }

    // Unmount only once the slide-out has finished
    animateTo(0, 200, ({ finished }) => {
      if (finished) setIsMounted(false);
    });
  }, [isSidebarOpen, isMounted]);

  // Android back button closes the sidebar instead of leaving the screen (no effect on iOS)
  useEffect(() => {
    if (!isSidebarOpen) return;

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        closeSidebar();
        return true;
      },
    );

    return () => subscription.remove();
  }, [isSidebarOpen]);

  // Debug log
  // console.log("Sidebar state:", { isSidebarOpen, isMounted, sidebarWidth });

  if (!isMounted) {
    return null;
  }

  // Slides the panel in from the left edge as progress goes from 0 to 1
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-sidebarWidth, 0],
  });

  // Fades the dark backdrop in up to 40% opacity
  const backdropOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.4],
  });

  return (
    <View style={SidebarStyle.overlay} {...panResponder.panHandlers}>
      <Animated.View
        style={[SidebarStyle.backdrop, { opacity: backdropOpacity }]}
      >
        <Pressable
          style={SidebarStyle.fill}
          onPress={closeSidebar}
          accessibilityRole="button"
          accessibilityLabel="Close menu"
        />
      </Animated.View>

      <Animated.View
        accessibilityViewIsModal={true}
        style={[
          SidebarStyle.panel,
          { width: sidebarWidth, transform: [{ translateX }] },
        ]}
      >
        <SidebarHeader
          profile={profile}
          stats={stats}
          onEditPress={() => handleNavigate(SIDEBAR_ROUTES.editProfile)}
        />

        {/* Only the menu scrolls, the header above stays fixed */}
        <ScrollView
          style={SidebarStyle.menu}
          contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        >
          {SIDEBAR_SECTIONS.map((section, index) => (
            <View
              key={section.title}
              style={[
                SidebarStyle.section,
                index > 0 && SidebarStyle.sectionDivider,
              ]}
            >
              <Text
                accessibilityRole="header"
                style={SidebarStyle.sectionTitle}
                maxFontSizeMultiplier={1.3}
              >
                {section.title}
              </Text>

              {section.items.map((item) => (
                <SidebarMenuItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  badge={getBadge(item)}
                  onPress={() => handleNavigate(item.route)}
                />
              ))}
            </View>
          ))}

          <View style={[SidebarStyle.section, SidebarStyle.sectionDivider]}>
            <SidebarMenuItem
              icon="log-out"
              label="Log out"
              isDestructive={true}
              showChevron={false}
              onPress={handleLogout}
            />
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const SidebarStyle = StyleSheet.create({
  // zIndex and elevation keep the sidebar above the header and tab bar on iOS and Android
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 100,
    elevation: 100,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: COLORS.black,
  },
  fill: {
    flex: 1,
  },
  panel: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: COLORS.white,
  },
  menu: {
    flex: 1,
  },
  section: {
    paddingVertical: 8,
  },
  sectionDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  sectionTitle: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 4,
    fontSize: FONT_SIZE.xs,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: COLORS.textSecondary,
  },
});
