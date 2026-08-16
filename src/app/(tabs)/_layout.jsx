import Lucide from "@react-native-vector-icons/lucide";
import { Tabs } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import AddMenuModal from "../../components/modal/addMenuModal";
import { COLORS } from "../../constants/brand";

export default function TabLayout() {
  const [isAddMenuVisible, setAddMenuVisible] = useState(false); // Tracks whether the add menu modal is currently visible
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textSecondary,
          tabBarStyle: {
            position: "relative",
            height: 80,
            backgroundColor: COLORS.white,
          },
        }}
      >
        <Tabs.Screen
          name="hangout"
          options={{
            title: "Hangout",
            tabBarIcon: ({ color, size }) => (
              <Lucide name="sparkles" size={20} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Map",
            tabBarIcon: ({ color, size }) => (
              <Lucide name="map" size={20} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="add"
          options={{
            title: "",
            tabBarItemStyle: {
              width: 50,
              height: 50,
            },
            tabBarIcon: () => (
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 35,
                  backgroundColor: COLORS.primary,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Lucide name="plus" size={30} color={COLORS.white} />
              </View>
            ),
          }}
          listeners={{
            // Stop the tab from navigating and open the add menu instead
            tabPress: (event) => {
              event.preventDefault();
              setAddMenuVisible(true);
            },
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
          name="feeds"
          options={{
            title: "Posts",
            tabBarIcon: ({ color, size }) => (
              <Lucide name="layout-grid" size={20} color={color} />
            ),
          }}
        />
      </Tabs>

      <AddMenuModal
        visible={isAddMenuVisible}
        onClose={() => setAddMenuVisible(false)}
      />
    </>
  );
}
