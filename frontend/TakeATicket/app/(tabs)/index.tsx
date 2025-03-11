import { Image, StyleSheet, Platform } from "react-native";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import { ITicket } from "@/@types/ticket";
import { GetUserById } from "@/services/users.service";
import {
  GetTicketsByUser,
  GetTicketsByAdmin,
} from "@/services/tickets.service";

export default function HomeScreen() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [, setError] = useState<string | null>(null);
  const userRole =
    localStorage.getItem("role") || sessionStorage.getItem("role");
  const userId =
    localStorage.getItem("userId") || sessionStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    const fetchUserAndTickets = async () => {
      try {
        const userResponse = await GetUserById(userId);
        const { name } = userResponse.data;
        setUser({ name });

        if (userRole === "admin") {
          const ticketsResponse = await GetTicketsByAdmin(userId);
          setTickets(ticketsResponse.data);
        } else {
          const ticketsResponse = await GetTicketsByUser(userId);
          setTickets(ticketsResponse.data);
        }
      } catch (error) {
        setError(`Failed to load data: ${error}`);
      }
    };

    fetchUserAndTickets();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      {!user ? (
        <ThemedText type="subtitle">Need to authenticate!</ThemedText>
      ) : (
        <>
          <ThemedView style={styles.stepContainer}>
            <ThemedText type="subtitle">Step 1: Try it</ThemedText>
            <ThemedText>
              Edit{" "}
              <ThemedText type="defaultSemiBold">
                app/(tabs)/index.tsx
              </ThemedText>{" "}
              to see changes. Press{" "}
              <ThemedText type="defaultSemiBold">
                {Platform.select({
                  ios: "cmd + d",
                  android: "cmd + m",
                  web: "F12",
                })}
              </ThemedText>{" "}
              to open developer tools.
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.stepContainer}>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
            <ThemedText>
              Tap the Explore tab to learn more about what's included in this
              starter app.
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.stepContainer}>
            <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
            <ThemedText>
              When you're ready, run{" "}
              <ThemedText type="defaultSemiBold">
                npm run reset-project
              </ThemedText>{" "}
              to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "}
              directory. This will move the current{" "}
              <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
              <ThemedText type="defaultSemiBold">app-example</ThemedText>.
            </ThemedText>
          </ThemedView>
        </>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
