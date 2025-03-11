import { ISignin } from "@/@types/authentication";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Signin } from "@/services/authentications.service";
import formStyles from "@/styles/formStyles";
import globalStyles from "@/styles/globalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Image, TouchableOpacity } from "react-native";

export default function SigninScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const handleSignin = async () => {
    const signin: ISignin = {
      email,
      password,
    };

    try {
      const signinResponse = await Signin(signin);
      const token = signinResponse.data.token;
      const userId = signinResponse.data.user.id;
      const userRole = signinResponse.data.user.role;

      if (rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("role", userRole);
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("userId", userId);
        sessionStorage.setItem("role", userRole);
      }

      router.push("/");
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
          style={formStyles.reactLogo}
        />
      }
    >
      <ThemedView style={globalStyles.container}>
        <ThemedText type="title" style={{ marginBottom: 10 }}>
          Sign in
        </ThemedText>
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
        <ThemedView
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <MaterialIcons
              name={rememberMe ? "check-box" : "check-box-outline-blank"}
              size={24}
              color="lightblue"
            />
            <ThemedText>Remember Me</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/")}>
            <ThemedText type="link" style={{ marginLeft: 40 }}>
              Forgot Password?
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
        <TouchableOpacity style={formStyles.button} onPress={handleSignin}>
          <ThemedText style={formStyles.buttonText}>Sign in</ThemedText>
        </TouchableOpacity>
        <ThemedView style={{ flexDirection: "row", alignItems: "center" }}>
          <ThemedText>Dont have an account?</ThemedText>
          <ThemedText
            type="link"
            style={{ marginLeft: 5 }}
            onPress={() => router.push("/screens/auth/signup")}
          >
            Click here
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}
