import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { storage } from "@/utils/storage";

type ValidIcons = "house.fill" | "lock.fill" | "person.fill";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const userId = await storage.getItem("userId");
      const userToken = await storage.getItem("token");
      setIsAuthenticated(!!(userId && userToken));
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

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
