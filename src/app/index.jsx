import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { getSession } from "../services/auth";

export default function Index() {
  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    const { session } = await getSession();

    // If there's a valid session, send the user straight to their feed
    if (session) {
      router.replace("/(tabs)/feeds");
      console.log("User is logged in, redirecting to feed...");
      return;
    }

    // No session (or an error checking it) — send them to the welcome screen
    router.replace("/(auth)/welcome");
  };

  // Show a spinner while the check is happening, so nothing flashes on screen
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
