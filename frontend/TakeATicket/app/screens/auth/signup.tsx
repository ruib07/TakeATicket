import { ISignup } from "@/@types/authentication";
import { Signup } from "@/services/authentications.service";
import formStyles from "@/styles/formStyles";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedPicker } from "@/components/ThemedPicker";

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [role, setRole] = useState("");

  const handleSignup = async () => {
    const newUser: ISignup = {
      name,
      email,
      password,
      role,
    };

    try {
      await Signup(newUser);
      Alert.alert("Success", "Account created successfully!", [
        {
          text: "OK",
          onPress: () => router.push("/screens/auth/signin"),
        },
      ]);
    } catch (error: any) {
      console.error("Signup error:", error);
      Alert.alert("Something went wrong", error.message || "Unknown error");
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={formStyles.reactLogo}
        />
      }
    >
      <ThemedView style={formStyles.container}>
        <ThemedText type="title" style={{ marginBottom: 10 }}>
          Signup
        </ThemedText>
        <ThemedView style={formStyles.formField}>
          <ThemedInput onChangeText={setName} placeholder="Name" value={name} />
        </ThemedView>
        <ThemedView style={formStyles.formField}>
          <ThemedInput
            onChangeText={setEmail}
            placeholder="Email"
            value={email}
            keyboardType="email-address"
          />
        </ThemedView>
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
              color="black"
            />
          </TouchableOpacity>
        </ThemedView>
        <ThemedView style={formStyles.formField}>
          <ThemedText type="subtitle">Choose your role:</ThemedText>
          <ThemedPicker
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
          <ThemedText style={formStyles.buttonText}>Signup</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}
