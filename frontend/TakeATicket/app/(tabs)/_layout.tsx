import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

type ValidIcons = "house.fill" | "lock.fill" | "person.fill";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("userId") || sessionStorage.getItem("userId")
      : null;
  const userToken =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || sessionStorage.getItem("token")
      : null;

  const isAuthenticated = userId && userToken;

  const screens = [
    {
      name: "index",
      title: "Home",
      icon: "house.fill" as ValidIcons,
    },
    !isAuthenticated
      ? {
          name: "authentication",
          title: "Authentication",
          icon: "lock.fill" as ValidIcons,
        }
      : {
          name: "profile",
          title: "Profile",
          icon: "person.fill" as ValidIcons,
        },
  ].filter(Boolean);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      {screens.map(({ name, title, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name={icon} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
