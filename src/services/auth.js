import getErrorMessage from "./errors";
import { supabase } from "./supabase";

// Creates a new user account
export async function signUp(name, email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });

  if (error) {
    return {
      user: null,
      error: getErrorMessage({ message: error.message, status: error.status }),
    };
  }

  return { user: data.user, error: null };
}

// Logs in an existing user with email and password
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { user: null, error: error.message };
  }

  return { user: data.user, error: null };
}

// Logs out the current user and clears the local session
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

// Returns the current session, or null if no one is logged in
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    return { session: null, error: error.message };
  }

  return { session: data.session, error: null };
}

// Sign out of every other active session, keeping only this one logged in
// await supabase.auth.signOut({ scope: "others" }); Uncomment When change password function is added
