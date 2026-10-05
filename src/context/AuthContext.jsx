import { createContext, useContext } from "react";

// Holds the one copy of session and profile that the whole app reads from
export const AuthContext = createContext(null);

// Lets any component read session, profile, loading and refreshProfile
export function useAuthContext() {
  const context = useContext(AuthContext);

  // If this is used outside the provider, fail loudly so the mistake is obvious
  if (!context) {
    throw new Error("useAuthContext must be used inside AuthContext.Provider");
  }

  return context;
}
