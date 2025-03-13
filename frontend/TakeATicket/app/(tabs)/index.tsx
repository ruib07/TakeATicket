import { ITicket } from "@/@types/ticket";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  GetTicketsByAdmin,
  GetTicketsByUser,
} from "@/services/tickets.service";
import { GetUserById } from "@/services/users.service";
import { storage } from "@/utils/storage";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { Image, StyleSheet } from "react-native";
import { DataTable } from "react-native-paper";

export default function HomeScreen() {
  const [, setUserId] = useState<string | null>(null);
  const [, setUserRole] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [, setError] = useState<string | null>(null);
  const tableBackground = useThemeColor({}, "tableHeader");
  const rowBackground = useThemeColor({}, "tableRow");

  useEffect(() => {
    const fetchUserAndTickets = async () => {
      const storedUserId = await storage.getItem("userId");
      const storedUserRole = await storage.getItem("role");

      setUserId(storedUserId);
      setUserRole(storedUserRole);

      if (!storedUserId || !storedUserRole) return;

      try {
        const userResponse = await GetUserById(storedUserId);
        const { name } = userResponse.data;
        setUser({ name });

        if (storedUserRole === "admin") {
          const ticketsResponse = await GetTicketsByAdmin(storedUserId);
          setTickets(ticketsResponse.data);
        } else {
          const ticketsResponse = await GetTicketsByUser(storedUserId);
          setTickets(ticketsResponse.data);
        }
      } catch (error) {
        setError(`Failed to load user and his tickets: ${error}`);
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
        <ThemedText type="title">Welcome {user?.name}!</ThemedText>
        <HelloWave />
      </ThemedView>
      {!user ? (
        <ThemedText type="subtitle" style={{ textAlign: "center" }}>
          Need to authenticate!
        </ThemedText>
      ) : (
        <>
          <ThemedView style={styles.stepContainer}>
            <ThemedText type="subtitle">Tickets</ThemedText>
            <DataTable style={{ padding: 15 }}>
              <DataTable.Header style={{ backgroundColor: tableBackground }}>
                <DataTable.Title style={{ flex: 2 }}>
                  <ThemedText type="table">Title</ThemedText>
                </DataTable.Title>
                <DataTable.Title style={{ marginEnd: 4 }}>
                  <ThemedText type="table">Deadline</ThemedText>
                </DataTable.Title>
                <DataTable.Title style={{ flex: 1 }}>
                  <ThemedText type="table">Status</ThemedText>
                </DataTable.Title>
              </DataTable.Header>

              {tickets.map((ticket, index) => (
                <DataTable.Row
                  key={index}
                  style={{ backgroundColor: rowBackground }}
                >
                  <DataTable.Cell style={{ flex: 2 }}>
                    <ThemedText type="table">{ticket.title}</ThemedText>
                  </DataTable.Cell>
                  <DataTable.Cell style={{ flex: 1 }}>
                    <ThemedText type="table">
                      {moment(ticket.deadline).format("HH:mm")}
                    </ThemedText>
                  </DataTable.Cell>
                  <DataTable.Cell style={{ flex: 1 }}>
                    <ThemedText type="table">{ticket.status}</ThemedText>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
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
    justifyContent: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
