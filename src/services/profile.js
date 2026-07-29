import { decode } from "base64-arraybuffer";
import { File } from "expo-file-system";
import { supabase } from "./supabase";

// Updates the logged-in user's profile row with the fields provided
export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    return { profile: null, error: error.message };
  }

  return { profile: data, error: null };
}

// Fetches a single profile by user id
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    return { profile: null, error: error.message };
  }

  return { profile: data, error: null };
}

// Uploads an avatar image to Storage and returns its public URL
export async function uploadAvatar(userId, imageUri) {
  // Pull the file extension off the picked image's URI
  const fileExt = imageUri.split(".").pop();

  // Build the storage path, one folder per user, so avatars don't collide across accounts
  const filePath = `${userId}/avatar.${fileExt}`;

  // Wrap the local file URI in a File instance so it can be read
  const file = new File(imageUri);

  // Read the file's contents as base64 text, since Supabase Storage can't take a raw file URI
  const base64 = await file.base64();

  // Convert the base64 string into binary data Supabase Storage expects
  const arrayBuffer = decode(base64);

  // Upload the binary data, overwriting any existing avatar at that path
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, arrayBuffer, {
      contentType: `image/${fileExt}`,
      upsert: true,
    });

  // Bail out early and hand the error back if the upload failed
  if (uploadError) {
    return { url: null, error: uploadError.message };
  }

  // Grab the public URL for the file we just uploaded
  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

  return { url: data.publicUrl, error: null };
}
