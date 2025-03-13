import { Image, Platform, TouchableOpacity } from "react-native";
import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import profileStyles from "@/styles/profileStyles";
import globalStyles from "@/styles/globalStyles";
import { storage } from "@/utils/storage";
import { useEffect, useState } from "react";
import { IUser } from "@/@types/user";
import { GetUserById } from "@/services/users.service";
import { router } from "expo-router";

export default function TabTwoScreen() {
  const [user, setUser] = useState<IUser>();

  useEffect(() => {
    const fetchUser = async () => {
      const storedUserId = await storage.getItem("userId");

      if (!storedUserId) return;

      try {
        const userResponse = await GetUserById(storedUserId);
        setUser(userResponse.data);
      } catch (error) {
        console.error(`Failed to load user: ${error}`);
      }
    };

    fetchUser();
  });

  const handleSignout = async () => {
    await storage.removeItem("token");
    await storage.removeItem("userId");
    await storage.removeItem("role");

    router.replace("/");
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={profileStyles.headerImage}
        />
      }
    >
      <ThemedView style={profileStyles.titleContainer}>
        <ThemedText type="title">Profile</ThemedText>
      </ThemedView>
      <Collapsible title="Your information">
        <ThemedText>
          <ThemedText type="defaultSemiBold">Name:</ThemedText> {user?.name}
        </ThemedText>
        <ThemedText>
          <ThemedText type="defaultSemiBold">Email:</ThemedText> {user?.email}
        </ThemedText>
        <ThemedText>
          <ThemedText type="defaultSemiBold">Role:</ThemedText> {user?.role}
        </ThemedText>
      </Collapsible>
      <ThemedView style={globalStyles.container}>
        <TouchableOpacity style={profileStyles.button} onPress={handleSignout}>
          <ThemedText style={profileStyles.buttonText}>Sign out</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}
