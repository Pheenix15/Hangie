import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="feeds"
        options={{ headerShown: true, title: "Back" }}
      />
    </Stack>
  );
}
