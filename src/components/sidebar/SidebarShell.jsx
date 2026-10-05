import { StyleSheet, View } from "react-native";
import { useSidebar } from "../../context/SidebarContext";
import Sidebar from "./Sidebar";

export default function SidebarShell({ children }) {
  const { isSidebarOpen } = useSidebar();

  return (
    <View style={SidebarShellStyle.container}>
      {/* Hide the screens behind the sidebar from screen readers while it is open */}
      <View
        style={SidebarShellStyle.content}
        importantForAccessibility={
          isSidebarOpen ? "no-hide-descendants" : "auto"
        }
        accessibilityElementsHidden={isSidebarOpen}
      >
        {children}
      </View>
      <Sidebar />
    </View>
  );
}

const SidebarShellStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
