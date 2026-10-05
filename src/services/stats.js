import { supabase } from "./supabase";

// Counts the hangouts the user has hosted, the other counts have no tables yet so they stay at 0
export async function getProfileStats(userId) {
  // head + exact count asks Supabase for the number only, not the rows
  const { count, error } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("host_id", userId);

  console.log("Profile stats result:", { count, error });

  if (error) {
    return { stats: null, error: error.message };
  }

  return {
    stats: { events: count ?? 0, friends: 0, posts: 0, communities: 0 },
    error: null,
  };
}
