import Lucide from "@react-native-vector-icons/lucide";
import { Pressable, StyleSheet, View } from "react-native";
import { COLORS } from "../../constants/brand";

export default function HeaderActions({ hasUnread = true }) {
  // Search and bell are placeholders for now, nothing is wired up yet
  return (
    <View style={HeaderActionsStyle.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Search"
        style={HeaderActionsStyle.button}
      >
        <Lucide name="search" size={24} color={COLORS.textSecondary} />
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          hasUnread
            ? "Notifications, you have unread notifications"
            : "Notifications"
        }
        style={HeaderActionsStyle.button}
      >
        <Lucide name="bell" size={24} color={COLORS.textSecondary} />
        {/* Unread dot, hardcoded on until notifications exist */}
        {hasUnread ? <View style={HeaderActionsStyle.dot} /> : null}
      </Pressable>
    </View>
  );
}

const HeaderActionsStyle = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  // 44x44 keeps the touch target large enough for accessibility
  button: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    position: "absolute",
    top: 9,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.error,
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
});
