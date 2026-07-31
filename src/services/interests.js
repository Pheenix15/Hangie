import { supabase } from "./supabase";

// Fetches every interest along with its category name, grouped by category
export async function getInterestsByCategory() {
  const { data, error } = await supabase
    .from("interests")
    .select("id, name, interest_categories(id, name)")
    .order("name");

  // console.log("Raw interests query - data:", data);
  // console.log("Raw interests query - error:", error);
  if (error) {
    return { categories: [], error: error.message };
  }

  // Groups the flat list of interests into an array of categories, each holding its own interests
  const grouped = {};

  data.forEach((interest) => {
    const categoryName = interest.interest_categories.name;

    if (!grouped[categoryName]) {
      grouped[categoryName] = [];
    }

    grouped[categoryName].push({ id: interest.id, name: interest.name });
  });

  const categories = Object.keys(grouped).map((categoryName) => ({
    category: categoryName,
    interests: grouped[categoryName],
  }));

  return { categories, error: null };
}

// Saves a user's chosen interests, replacing whatever was selected before
export async function saveUserInterests(userId, interestIds) {
  // If the user is editing their interests later, clear out the old selections first
  const { error: deleteError } = await supabase
    .from("user_interests")
    .delete()
    .eq("user_id", userId);

  if (deleteError) {
    return { error: deleteError.message };
  }

  // Build one row per selected interest, all linked to this user
  const rows = interestIds.map((interestId) => ({
    user_id: userId,
    interest_id: interestId,
  }));

  const { error: insertError } = await supabase
    .from("user_interests")
    .insert(rows);

  if (insertError) {
    return { error: insertError.message };
  }

  return { error: null };
}

// Adds a new interest under a specific category, created by the current user
export async function addInterest(name, categoryId, userId) {
  const { data, error } = await supabase
    .from("interests")
    .insert({ name: name.trim(), category_id: categoryId, created_by: userId })
    .select()
    .single();

  if (error) {
    // If the error code is 23505, this interest name already exists
    if (error.code === "23505") {
      return { interest: null, error: "This interest already exists." };
    }

    return { interest: null, error: error.message };
  }

  return { interest: data, error: null };
}
