import { supabase } from "./supabase";

export async function testSupabaseConnection() {
  const { data, error } = await supabase.auth.getSession();

  // If this fails, the URL or key is wrong
  if (error) {
    console.log("Supabase connection FAILED:", error.message);
    return false;
  }

  console.log("Supabase connection SUCCESS. Session data:", data);
  return true;
}
