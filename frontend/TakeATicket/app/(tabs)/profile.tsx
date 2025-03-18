import { IUser } from "@/@types/user";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuth } from "@/context/AuthContext";
import { GetUserById, UpdateUser } from "@/services/users.service";
import globalStyles from "@/styles/globalStyles";
import profileStyles from "@/styles/profileStyles";
import { storage } from "@/utils/storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, TouchableOpacity } from "react-native";

export default function ProfileScreen() {
  const [user, setUser] = useState<IUser>();
  const [, setError] = useState<string | null>(null);
  const { setAuth } = useAuth();
  const [editableName, setEditableName] = useState<string>("");
  const [editableEmail, setEditableEmail] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      const storedUserId = await storage.getItem("userId");

      if (!storedUserId) {
        setUser(undefined);
        setEditableName("");
        setEditableEmail("");
        return;
      }

      try {
        const userResponse = await GetUserById(storedUserId);
        setUser(userResponse.data);
        setEditableName(userResponse.data.name);
        setEditableEmail(userResponse.data.email);
      } catch {
        setError("Failed to load user.");
      }
    };

    fetchUser();
  }, []);

  const handleUserUpdate = async (userId: string, update: Partial<IUser>) => {
    try {
      const updatedUser = {
        ...user,
        ...update,
      };

      await UpdateUser(userId, updatedUser);
      Alert.alert("User information updated successfully.");
      setIsEditing(false);
    } catch (error) {
      setError("Failed to update user.");
    }
  };

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
        <ThemedText style={profileStyles.text}>
          <ThemedText type="subtitleSemiBold">Name:</ThemedText>
        </ThemedText>
        <ThemedInput
          style={{ marginBottom: 20 }}
          value={editableName}
          onChangeText={setEditableName}
          editable={isEditing}
        />
        <ThemedText style={profileStyles.text}>
          <ThemedText type="subtitleSemiBold">Email:</ThemedText>
        </ThemedText>
        <ThemedInput
          value={editableEmail}
          onChangeText={setEditableEmail}
          editable={isEditing}
        />
      </ThemedView>
      <ThemedView style={globalStyles.container}>
        <TouchableOpacity
          style={profileStyles.button}
          onPress={() => {
            if (isEditing) {
              handleUserUpdate(user?.id || "", {
                name: editableName,
                email: editableEmail,
              });
            } else {
              setIsEditing(true);
            }
          }}
        >
          <ThemedText style={profileStyles.buttonText}>
            {isEditing ? "Save Changes" : "Edit Information"}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={profileStyles.button} onPress={handleSignout}>
          <ThemedText style={profileStyles.buttonText}>Sign out</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}
