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

// Uploads an avatar image to Cloudinary and returns its public URL
export function uploadAvatar(userId, imageUri) {
  const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  // Figure out the file extension so the correct image type is sent
  const fileExt = imageUri.split(".").pop().toLowerCase();

  const formData = new FormData();

  formData.append("file", {
    uri: imageUri,
    type: `image/${fileExt === "jpg" ? "jpeg" : fileExt}`,
    name: `${userId}_avatar.${fileExt}`,
  });

  formData.append("upload_preset", uploadPreset);
  formData.append("folder", `hangie/avatars/${userId}`);

  // XMLHttpRequest is used here instead of fetch, since Expo's fetch does not support React Native's file object format in FormData
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", url);

    // If the upload finishes, parse the response and resolve with the result
    xhr.onload = () => {
      console.log("Cloudinary raw response:", xhr.responseText);

      try {
        const data = JSON.parse(xhr.responseText);

        if (data.error) {
          resolve({ url: null, error: data.error.message });
          return;
        }

        resolve({ url: data.secure_url, error: null });
      } catch (err) {
        resolve({ url: null, error: "Could not read upload response." });
      }
    };

    // If the request itself fails, resolve with a network error
    xhr.onerror = () => {
      console.log("XHR upload error");
      resolve({
        url: null,
        error: "Could not upload image. Check your connection.",
      });
    };

    xhr.send(formData);
  });
}
