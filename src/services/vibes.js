import { supabase } from "./supabase";

// Fetches every row from the fixed vibes list
export async function getVibes() {
  const { data, error } = await supabase.from("vibes").select("id, name");

  //console.log("getVibes:", { data, error }); //For debugging purposes
  if (error) {
    return { vibes: null, error: error.message };
  }

  return { vibes: data, error: null };
}
