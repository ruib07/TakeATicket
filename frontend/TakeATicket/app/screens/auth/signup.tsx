import { ISignup } from "@/@types/authentication";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedModal } from "@/components/ThemedModal";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { Signup } from "@/services/authentications.service";
import formStyles from "@/styles/formStyles";
import globalStyles from "@/styles/globalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, TouchableOpacity } from "react-native";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [role, setRole] = useState("");
  const colorScheme = useColorScheme();

  const iconColor = colorScheme === "light" ? "black" : "#9BA1A6";

  const handleSignup = async () => {
    const newUser: ISignup = {
      name,
      email,
      password,
      role,
    };

    try {
      await Signup(newUser);
      router.push("/screens/auth/signin");
    } catch (error: any) {
      Alert.alert("Something went wrong", error.message || "Unknown error");
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={globalStyles.reactLogo}
        />
      }
    >
      <ThemedView style={globalStyles.container}>
        <ThemedText type="title" style={{ marginBottom: 10 }}>
          Sign up
        </ThemedText>
        <ThemedView style={formStyles.formField}>
          <ThemedInput onChangeText={setName} placeholder="Name" value={name} />
          <ThemedInput
            onChangeText={setEmail}
            placeholder="Email"
            value={email}
            keyboardType="email-address"
          />
          <ThemedView style={formStyles.formField}>
            <ThemedInput
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
              placeholder="Password"
              value={password}
            />
            <TouchableOpacity
              style={formStyles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialIcons
                name={showPassword ? "visibility-off" : "visibility"}
                size={24}
                color={iconColor}
              />
            </TouchableOpacity>
          </ThemedView>
          <ThemedText type="subtitle" style={{ marginBottom: 8 }}>
            Choose your role:
          </ThemedText>
          <ThemedModal
            selectedValue={role}
            onValueChange={(itemValue) => setRole(itemValue)}
            items={[
              { label: "Select a role...", value: "" },
              { label: "Admin", value: "admin" },
              { label: "User", value: "user" },
            ]}
          />
        </ThemedView>
        <TouchableOpacity style={formStyles.button} onPress={handleSignup}>
          <ThemedText style={formStyles.buttonText}>Sign up</ThemedText>
        </TouchableOpacity>
        <ThemedView style={{ flexDirection: "row", alignItems: "center" }}>
          <ThemedText>Already have an account?</ThemedText>
          <ThemedText
            type="link"
            style={{ marginLeft: 5 }}
            onPress={() => router.push("/screens/auth/signin")}
          >
            Click here
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}
