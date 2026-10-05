import { createContext, useContext, useState } from "react";

// Shared sidebar state so any screen can open it and the sidebar can read it
const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  // Tracks whether the sidebar is currently open
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Open the sidebar
  const openSidebar = () => {
    setSidebarOpen(true);
  };

  // Close the sidebar
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <SidebarContext.Provider
      value={{ isSidebarOpen, openSidebar, closeSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

// Gives components access to the sidebar state and its open/close functions
export function useSidebar() {
  const context = useContext(SidebarContext);

  // If this is used outside the provider, fail loudly so the mistake is obvious
  if (!context) {
    throw new Error("useSidebar must be used inside SidebarProvider");
  }

  return context;
}
