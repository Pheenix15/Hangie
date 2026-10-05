// styles/commonStyles.js

import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZE } from "../constants/brand";

export const globalStyles = StyleSheet.create({
  screen: {
    height: "100%",
    paddingHorizontal: 10,
    paddingTop: 50,
    paddingBottom: 30,
    backgroundColor: COLORS.background,
  },

  input: {
    borderWidth: 0.4,
    borderColor: COLORS.textSecondary,
    borderRadius: 9,
    backgroundColor: COLORS.surface,
    padding: 10,
    overflow: "clip",
  },

  form: {
    gap: 20,
    marginTop: 20,
  },

  introText: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: 600,
  },

  subText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: 500,
    color: COLORS.textSecondary,
  },

  error: {
    backgroundColor: COLORS.error,
    color: COLORS.textWhite,
    padding: 10,
  },

  aiAssist: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 15,
  },

  aiAssistText: {
    color: COLORS.textPrimary,
    fontWeight: 600,
  },
});
