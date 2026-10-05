import Lucide from "@react-native-vector-icons/lucide";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZE } from "../../constants/brand";

export default function SidebarMenuItem({
  icon,
  label,
  badge,
  onPress,
  isDestructive = false,
  showChevron = true,
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={badge ? `${label}, ${badge}` : label}
      style={({ pressed }) => [
        SidebarMenuItemStyle.row,
        pressed && SidebarMenuItemStyle.pressed,
      ]}
    >
      <Lucide
        name={icon}
        size={22}
        color={isDestructive ? COLORS.error : COLORS.textSecondary}
      />
      <Text
        style={[
          SidebarMenuItemStyle.label,
          { color: isDestructive ? COLORS.error : COLORS.text },
        ]}
        maxFontSizeMultiplier={1.3}
      >
        {label}
      </Text>

      {/* A badge replaces the chevron on the items that have one */}
      {badge ? (
        <View style={SidebarMenuItemStyle.badge}>
          <Text
            style={SidebarMenuItemStyle.badgeText}
            maxFontSizeMultiplier={1.3}
          >
            {badge}
          </Text>
        </View>
      ) : showChevron ? (
        <Lucide name="chevron-right" size={20} color={COLORS.textSecondary} />
      ) : null}
    </Pressable>
  );
}

const SidebarMenuItemStyle = StyleSheet.create({
  // 52 high keeps the touch target accessible
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 52,
    paddingHorizontal: 24,
  },
  pressed: {
    backgroundColor: COLORS.surface,
  },
  label: {
    flex: 1,
    marginLeft: 16,
    fontSize: FONT_SIZE.md,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: COLORS.secondary,
  },
  badgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
});
