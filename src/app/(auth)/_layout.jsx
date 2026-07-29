import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen
        name="signup"
        options={{ headerShown: true, title: "Back" }}
      />
      <Stack.Screen
        name="login"
        options={{ headerShown: true, title: "Back" }}
      />

      <Stack.Screen
        name="profileSetup"
        options={{ headerShown: true, title: "Back" }}
      />

      <Stack.Screen
        name="locationSetup"
        options={{ headerShown: true, title: "Back" }}
      />
    </Stack>
  );
}
