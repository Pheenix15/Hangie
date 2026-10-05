import { Stack } from "expo-router";

export default function SettingsLayout() {
  // Header is off, each screen handles it's own header and back button
  return <Stack screenOptions={{ headerShown: false }} />;
}
