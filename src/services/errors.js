const KNOWN_MESSAGES = {
  "Invalid login credentials": "Incorrect email or password.",
  "User already registered": "An account with this email already exists.",
  "Email not confirmed": "Please confirm your email before logging in.",
  "Password should be at least 6 characters":
    "Password must be at least 6 characters long.",
};

const STATUS_MESSAGES = {
  400: "That request could not be understood. Please check your input and try again.",
  401: "You need to be logged in to do that.",
  403: "You don't have permission to do that.",
  404: "We couldn't find what you were looking for.",
  409: "This conflicts with something that already exists.",
  429: "Too many attempts. Please wait a moment and try again.",
  500: "Something went wrong on our end. Please try again shortly.",
  503: "The service is temporarily unavailable. Please try again shortly.",
};

// Maps Postgres error codes to human-readable text, used for direct database errors
const POSTGRES_CODES = {
  23505: "This already exists.",
  23503: "This can't be completed because related data is missing.",
  23502: "A required field is missing.",
};

// Converts any raw error (message, status code, or Postgres code) into a message safe to show users
export function getErrorMessage({ message, status, code } = {}) {
  // If the message is one of the specifically known cases, return its friendly version
  if (message && KNOWN_MESSAGES[message]) {
    return KNOWN_MESSAGES[message];
  }

  // If a Postgres code is given and has a mapped message, return that instead
  if (code && POSTGRES_CODES[code]) {
    return POSTGRES_CODES[code];
  }

  // If a status code is given and has a mapped generic message, return that instead
  if (status && STATUS_MESSAGES[status]) {
    return STATUS_MESSAGES[status];
  }

  // If nothing matches, fall back to one final generic message
  return "Something went wrong. Please try again.";
}
