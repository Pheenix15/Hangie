import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import SidebarShell from "../components/sidebar/SidebarShell";
import { AuthContext } from "../context/AuthContext";
import { SidebarProvider } from "../context/SidebarContext";
import { useAuth } from "../hooks/useAuth";

const PUBLIC_ROUTES = ["welcome", "login", "signup"];
const ONBOARDING_ROUTES = [
  "profileSetup",
  "locationSetup",
  "interestsSetup",
  "hangoutSetup",
];
const UNGATED_ROUTES = ["notificationSetup"]; //Part of onboarding routes but does not trigger redirect

export default function RootLayout() {
  const auth = useAuth();
  const { session, profile, loading } = auth;
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const currentScreen = segments[1];
    const isPublicRoute = PUBLIC_ROUTES.includes(currentScreen);
    const isOnboardingRoute = ONBOARDING_ROUTES.includes(currentScreen);
    const isUngatedRoute = UNGATED_ROUTES.includes(currentScreen);

    // If is Ungated route, exempt from redirect checks entirely
    if (isUngatedRoute) return;

    // If there is no session and the current screen is not public, redirect to welcome
    if (!session && !isPublicRoute) {
      router.replace("/(auth)/welcome");
      return;
    }

    // If there is a session and onboarding is not complete and the current screen is not an onboarding screen, redirect to profile setup
    if (session && !profile?.onboarding_completed && !isOnboardingRoute) {
      router.replace("/(auth)/profileSetup");
      console.log(session);
      return;
    }

    // If there is a session and onboarding is complete and the current screen is public or an onboarding screen, redirect to feeds
    if (
      session &&
      profile?.onboarding_completed &&
      (isPublicRoute || isOnboardingRoute)
    ) {
      router.replace("/(tabs)/posts");
    }
  }, [session, profile, loading, segments]);

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={auth}>
      <SidebarProvider>
        <SidebarShell>
          {/* Groups(e.g (tabs), (settings)...) stacks untop each other, so a group does not unmount when another group mounts */}
          <Stack screenOptions={{ headerShown: false }} />
        </SidebarShell>
      </SidebarProvider>
    </AuthContext.Provider>
  );
}
