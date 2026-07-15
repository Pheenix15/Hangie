import { Pressable, StyleSheet, Text } from "react-native";
import { COLORS, FONT_SIZE } from "../../constants/brand";

export default function Button({
  title,
  icon, //Incase button has icon
  onPress,
  style,
  textStyle,
  variant = "fill",
  disabled = false,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        buttonStyle.base,
        buttonStyle[variant],
        pressed && buttonStyle.pressed,
        disabled && buttonStyle.disabled,
        style,
      ]}
    >
      {icon}
      <Text
        style={[buttonStyle.baseText, buttonStyle[`${variant}Text`], textStyle]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const buttonStyle = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    gap: 10,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
  },

  fill: {
    backgroundColor: COLORS.primary,
  },

  outline: {
    backgroundColor: "transparent",
    borderWidth: 0.5,
    borderColor: COLORS.primary,
  },

  baseText: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },

  fillText: {
    color: COLORS.textWhite,
  },

  outlineText: {
    color: COLORS.textSecondary,
  },

  pressed: {
    opacity: 0.7,
  },

  disabled: {
    opacity: 0.4,
  },
});
