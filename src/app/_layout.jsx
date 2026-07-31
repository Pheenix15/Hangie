import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

// Screens reachable without being logged in
const PUBLIC_ROUTES = ["welcome", "login", "signup"];

export default function RootLayout() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // segments[0] is the route group, e.g. "(auth)" or "(tabs)"
    // segments[1] is the actual screen name inside that group, e.g. "welcome" or "profileSetup"
    const currentScreen = segments[1];
    const isPublicRoute = PUBLIC_ROUTES.includes(currentScreen);

    // If user has no session and trying to reach a private route - send to welcome
    if (!session && !isPublicRoute) {
      console.log("no active session redirecting...");
      router.replace("/(auth)/hangoutSetup");
      return;
    }

    // Has a session but sitting on welcome/login/signup - send to feeds instead
    if (session && isPublicRoute) {
      console.log("session active redirecting...");
      router.replace("/(tabs)/feeds");
    }
  }, [session, loading, segments]);

  if (loading) {
    return null;
  }

  return <Slot />;
}
