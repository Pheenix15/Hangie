import { Stack, router } from "expo-router";
import { Pressable, Text } from "react-native";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="hostEvent" options={{ headerShown: false }} />
      <Stack.Screen
        name="suggestHangout"
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
    </Stack>
  );
}
