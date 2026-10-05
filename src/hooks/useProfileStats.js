import { useEffect, useState } from "react";
import { getProfileStats } from "../services/stats";

// Starting values, friends, posts and communities stay at 0 until their tables exist
const EMPTY_STATS = { events: 0, friends: 0, posts: 0, communities: 0 };

// Loads the user's sidebar counts and refreshes them every time the sidebar opens
export function useProfileStats(userId, isOpen) {
  const [stats, setStats] = useState(EMPTY_STATS);

  useEffect(() => {
    // If nobody is logged in, clear the counts so the next user doesn't see the old ones
    if (!userId) {
      setStats(EMPTY_STATS);
      return;
    }

    // Only fetch when the sidebar is open
    if (!isOpen) return;

    const loadStats = async () => {
      const { stats: fetchedStats, error } = await getProfileStats(userId);

      // On error keep the old numbers so the sidebar doesn't flash back to zero
      if (!error) {
        setStats(fetchedStats);
      }
    };

    loadStats();
  }, [isOpen, userId]);

  return { stats };
}
