import { IUser } from "@/@types/user";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuth } from "@/context/AuthContext";
import { GetUserById } from "@/services/users.service";
import globalStyles from "@/styles/globalStyles";
import profileStyles from "@/styles/profileStyles";
import { storage } from "@/utils/storage";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { TouchableOpacity } from "react-native";

export default function TabTwoScreen() {
  const [user, setUser] = useState<IUser>();
  const { setAuth } = useAuth();

  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        const storedUserId = await storage.getItem("userId");

        if (!storedUserId) {
          setUser(undefined);
          return;
        }

        try {
          const userResponse = await GetUserById(storedUserId);
          setUser(userResponse.data);
        } catch (error) {
          console.error(`Failed to load user: ${error}`);
        }
      };

      fetchUser();
    }, [user])
  );

  const handleSignout = async () => {
    await storage.removeItem("token");
    await storage.removeItem("userId");
    await storage.removeItem("role");

    setUser(undefined);

    setAuth(null, null);
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
      <ThemedView style={globalStyles.container}>
        <ThemedText style={{ fontSize: 20, marginBottom: 14 }}>
          <ThemedText type="subtitleSemiBold">Name:</ThemedText> {user?.name}
        </ThemedText>
        <ThemedText style={{ fontSize: 20 }}>
          <ThemedText type="subtitleSemiBold">Email:</ThemedText> {user?.email}
        </ThemedText>
      </ThemedView>
      <ThemedView style={globalStyles.container}>
        <TouchableOpacity style={profileStyles.button} onPress={handleSignout}>
          <ThemedText style={profileStyles.buttonText}>Sign out</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}
