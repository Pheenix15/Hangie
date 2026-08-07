import { Stack, router } from "expo-router";
import { Pressable, Text } from "react-native";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen
        name="signup"
        options={{
          title: "",
          headerTransparent: true,
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <Text>Back</Text>
            </Pressable>
          ),
        }}
      />

      <Stack.Screen
        name="login"
        options={{
          title: "",
          headerTransparent: true,
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <Text>Back</Text>
            </Pressable>
          ),
        }}
      />

      <Stack.Screen name="profileSetup" options={{ headerShown: false }} />

      <Stack.Screen name="locationSetup" options={{ headerShown: false }} />

      <Stack.Screen
        name="interestsSetup"
        options={{
          title: "",
          headerTransparent: true,
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <Text>Back</Text>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={() => router.push("/hangoutSetup")}>
              <Text>Skip</Text>
            </Pressable>
          ),
        }}
      />

      <Stack.Screen
        name="hangoutSetup"
        options={{
          title: "",
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <Text>Back</Text>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={() => router.push("/notificationSetup")}>
              <Text>Skip</Text>
            </Pressable>
          ),
        }}
      />

      <Stack.Screen
        name="notificationSetup"
        options={{
          title: "",
          headerTransparent: true,
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <Text>Back</Text>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={() => router.push("/notificationSetup")}>
              <Text>Skip</Text>
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
