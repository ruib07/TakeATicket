import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { getScreens } from "@/constants/Screens";
import { useColorScheme } from "@/hooks/useColorScheme";
import { storage } from "@/utils/storage";
import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";

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

    const interval = setInterval(checkAuth, 500);

    return () => clearInterval(interval);
  }, []);

  if (isAuthenticated === null) return null;

  const screens = getScreens(isAuthenticated);

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
