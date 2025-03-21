import { INotification } from "@/@types/notification";
import { ITicket } from "@/@types/ticket";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { useThemeColor } from "@/hooks/useThemeColor";
import { CreateNotification } from "@/services/notifications.service";
import {
  DeleteTicket,
  GetTicketsByAdmin,
  GetTicketsByUser,
  UpdateTicket,
} from "@/services/tickets.service";
import { GetUserById } from "@/services/users.service";
import formStyles from "@/styles/formStyles";
import globalStyles from "@/styles/globalStyles";
import { router } from "expo-router";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { Alert, Image, TouchableOpacity } from "react-native";
import { DataTable, IconButton } from "react-native-paper";

export default function HomeScreen() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [, setError] = useState<string | null>(null);

  const { userId, userRole } = useAuth();
  const tableBackground = useThemeColor({}, "tableHeader");
  const rowBackground = useThemeColor({}, "tableRow");
  const colorScheme = useColorScheme();

  const iconColor = colorScheme === "light" ? "black" : "#9BA1A6";

  useEffect(() => {
    const fetchUserAndTickets = async () => {
      if (!userId || !userRole) {
        setUser(null);
        setTickets([]);
        return;
      }

      try {
        const userResponse = await GetUserById(userId);
        setUser({ name: userResponse.data.name });

        const ticketsResponse =
          userRole === "admin"
            ? await GetTicketsByAdmin(userId)
            : await GetTicketsByUser(userId);

        setTickets(ticketsResponse.data);
      } catch {
        setError("Failed to load user and tickets");
      }
    };

    fetchUserAndTickets();
  }, [userId, userRole]);

  const handleTicketStatusUpdate = async (ticketId: string, status: string) => {
    try {
      const ticketToUpdate = tickets.find((ticket) => ticket.id === ticketId);
      if (!ticketToUpdate) return;

      const updatedTicket = { status };

      await UpdateTicket(ticketId, updatedTicket);

      const newNotification: INotification = {
        ticket_id: ticketId,
        user_id: ticketToUpdate.user_id,
        admin_id: ticketToUpdate.admin_id,
        content:
          updatedTicket.status === "accepted"
            ? "Your ticket has been accepted"
            : "Your ticket has been rejected",
        status: "unread",
      };

      await CreateNotification(newNotification);

      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, ...updatedTicket } : ticket
        )
      );
      Alert.alert("Ticket status updated successfully.");
    } catch (error) {
      setError("Failed to update ticket status.");
    }
  };

  const handleTicketRemoval = async (ticketId: string) => {
    try {
      await DeleteTicket(ticketId);
      setTickets((prevTickets) =>
        prevTickets.filter((ticket) => ticket.id !== ticketId)
      );
      Alert.alert("Ticket removed successfully.");
    } catch {
      setError("Failed to remove ticket");
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
      <ThemedView style={globalStyles.titleContainer}>
        <ThemedText type="title">Welcome {user?.name}!</ThemedText>
        <HelloWave />
      </ThemedView>
      {!user ? (
        <ThemedText type="subtitle" style={{ textAlign: "center" }}>
          Need to authenticate!
        </ThemedText>
      ) : (
        <>
          <ThemedView style={globalStyles.stepContainer}>
            <ThemedText type="subtitle">Tickets</ThemedText>
            <DataTable>
              <DataTable.Header style={{ backgroundColor: tableBackground }}>
                <DataTable.Title style={{ flex: 2 }}>
                  <ThemedText type="table">Title</ThemedText>
                </DataTable.Title>
                <DataTable.Title>
                  <ThemedText type="table">Deadline</ThemedText>
                </DataTable.Title>
                <DataTable.Title>
                  <ThemedText type="table">Status</ThemedText>
                </DataTable.Title>
                <DataTable.Title>
                  <ThemedText type="table">Actions</ThemedText>
                </DataTable.Title>
              </DataTable.Header>

              {tickets.map((ticket, index) => (
                <DataTable.Row
                  key={index}
                  style={{ backgroundColor: rowBackground }}
                >
                  <DataTable.Cell style={{ flex: 2 }}>
                    <ThemedText
                      type="table"
                      onPress={() =>
                        router.push(
                          `/screens/tickets/ticketdetails?id=${ticket.id}`
                        )
                      }
                    >
                      {ticket.title}
                    </ThemedText>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <ThemedText type="table">
                      {moment(ticket.deadline).format("DD/MM")}
                    </ThemedText>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <ThemedText type="table">{ticket.status}</ThemedText>
                  </DataTable.Cell>
                  <DataTable.Cell
                    style={{
                      flex: 1,
                      flexDirection: "row",
                    }}
                  >
                    {userRole === "user" ? (
                      <IconButton
                        icon="delete"
                        size={18}
                        iconColor={iconColor}
                        onPress={() => handleTicketRemoval(ticket.id!)}
                      />
                    ) : (
                      ticket.status !== "completed" && (
                        <>
                          <IconButton
                            icon="check"
                            size={18}
                            iconColor={iconColor}
                            onPress={() =>
                              handleTicketStatusUpdate(ticket.id!, "accepted")
                            }
                          />
                          <IconButton
                            icon="close"
                            size={18}
                            iconColor={iconColor}
                            onPress={() =>
                              handleTicketStatusUpdate(ticket.id!, "rejected")
                            }
                          />
                        </>
                      )
                    )}
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
            {userRole === "user" && (
              <TouchableOpacity
                style={formStyles.button}
                onPress={() => router.push("/screens/tickets/createticket")}
              >
                <ThemedText style={formStyles.buttonText}>
                  New Ticket
                </ThemedText>
              </TouchableOpacity>
            )}
          </ThemedView>
        </>
      )}
    </ParallaxScrollView>
  );
}
