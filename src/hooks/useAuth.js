import { useEffect, useState } from "react";
import { getProfile } from "../services/profile";
import { supabase } from "../services/supabase";

// Tracks the current session and profile, keeping both updated in real time
export function useAuth() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the profile row for whatever user id is passed in
  const loadProfile = async (userId) => {
    const { profile: fetchedProfile } = await getProfile(userId);
    setProfile(fetchedProfile);
  };

  useEffect(() => {
    // Get whatever session exists right when the app opens
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);

      // If a session exists, load its profile too before finishing the loading state
      if (data.session) {
        await loadProfile(data.session.user.id);
      }

      setLoading(false);
    });

    // Keep listening for login, logout, or token refresh for the rest of the app's life
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);

        // If the new session has a user, load their profile, otherwise clear it out
        if (newSession) {
          await loadProfile(newSession.user.id);
        } else {
          setProfile(null);
        }
      },
    );

    // Stop listening when this hook is no longer in use
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Re-fetch the current user's profile on demand, for screens that update it directly
  const refreshProfile = async () => {
    if (session) {
      await loadProfile(session.user.id);
    }
  };

  return { session, profile, loading, refreshProfile };
}
