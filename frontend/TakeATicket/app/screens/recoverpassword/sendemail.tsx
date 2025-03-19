import { ISendEmail } from "@/@types/resetPassword";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SendEmail } from "@/services/resetPasswords.service";
import formStyles from "@/styles/formStyles";
import globalStyles from "@/styles/globalStyles";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Image, TouchableOpacity } from "react-native";

export default function SendEmailToRecover() {
  const [email, setEmail] = useState("");

  const handleSendEmail = async () => {
    const emailReq: ISendEmail = {
      email,
    };

    try {
      await SendEmail(emailReq);
      Alert.alert("Email sent successfully.");
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
          source={require("@/assets/images/takeaticketbanner.png")}
          style={globalStyles.takeaticketLogo}
        />
      }
    >
      <ThemedView style={globalStyles.container}>
        <ThemedText type="title" style={{ marginBottom: 10 }}>
          Recover Password
        </ThemedText>
        <ThemedView style={formStyles.formField}>
          <ThemedInput
            onChangeText={setEmail}
            placeholder="Email"
            value={email}
            keyboardType="email-address"
          />
        </ThemedView>
        <TouchableOpacity style={formStyles.button} onPress={handleSendEmail}>
          <ThemedText style={formStyles.buttonText}>Send Email</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}
