import Lucide from "@react-native-vector-icons/lucide";
import { Tabs } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import AppHeader from "../../components/header/AppHeader";
import HeaderActions from "../../components/header/HeaderActions";
import AddMenuModal from "../../components/modal/addMenuModal";
import { COLORS } from "../../constants/brand";

export default function TabLayout() {
  const [isAddMenuVisible, setAddMenuVisible] = useState(false); // Tracks whether the add menu modal is currently visible
  return (
    <>
      <Tabs
        backBehavior="history"
        screenOptions={{
          headerShown: true,
          header: (props) => <AppHeader {...props} />,
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
            headerRight: () => <HeaderActions />,
            title: "Hangout",
            tabBarIcon: ({ color, size }) => (
              <Lucide name="sparkles" size={20} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="map"
          options={{
            title: "Map",
            headerTitle: "Nearby",
            headerRight: () => <HeaderActions />,
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
            headerTitle: "Messages",
            headerRight: () => <HeaderActions />,
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
          name="posts"
          options={{
            title: "Posts",
            headerTitle: "Posts",
            headerRight: () => <HeaderActions />,
            tabBarIcon: ({ color, size }) => (
              <Lucide name="layout-grid" size={20} color={color} />
            ),
          }}
        />

        {/* Hidden Tabs (Basically, the rest of the screens) */}

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerTitle: "My Profile",
            headerRight: () => <HeaderActions />,
            href: null, //So profile doesn't show on the tabs list
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
