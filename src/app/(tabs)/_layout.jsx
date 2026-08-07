import Lucide from "@react-native-vector-icons/lucide";
import { Tabs } from "expo-router";
import { COLORS } from "../../constants/brand";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="feeds"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Lucide name="house" size={20} color={COLORS.textSecondary} />
          ),
        }}
      />

      <Tabs.Screen
        name="hangout"
        options={{
          title: "Hangout",
          tabBarIcon: ({ color, size }) => (
            <Lucide name="sparkles" size={20} color={COLORS.textSecondary} />
          ),
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size }) => (
            <Lucide
              name="message-square-text"
              size={20}
              color={COLORS.textSecondary}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Lucide name="user" size={20} color={COLORS.textSecondary} />
          ),
        }}
      />
    </Tabs>
  );
}
