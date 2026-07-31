import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

// Tracks the current session and keeps it updated in real time
export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get whatever session exists right when the app opens
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // Keep listening for login, logout, or token refresh for the rest of the app's life
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      },
    );

    // Stop listening when this hook is no longer in use
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { session, loading };
}
