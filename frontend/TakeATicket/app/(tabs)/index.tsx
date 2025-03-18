import { ITicket } from "@/@types/ticket";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextArea } from "@/components/ThemedTextArea";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  DeleteTicket,
  GetTicketsByAdmin,
  GetTicketsByUser,
  UpdateTicket,
} from "@/services/tickets.service";
import { GetUserById } from "@/services/users.service";
import formStyles from "@/styles/formStyles";
import globalStyles from "@/styles/globalStyles";
import modalStyles from "@/styles/modalStyles";
import { router } from "expo-router";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { Alert, Image, Modal, TouchableOpacity, View } from "react-native";
import { DataTable, IconButton } from "react-native-paper";

export default function HomeScreen() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [editingTicket, setEditingTicket] = useState<ITicket | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [, setError] = useState<string | null>(null);

  const tableBackground = useThemeColor({}, "tableHeader");
  const rowBackground = useThemeColor({}, "tableRow");
  const colorScheme = useColorScheme();

  const iconColor = colorScheme === "light" ? "black" : "#9BA1A6";

  const { userId, userRole } = useAuth();

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

  const handleTicketUpdate = async (
    ticketId: string,
    updates: Partial<ITicket>
  ) => {
    try {
      const ticketToUpdate = tickets.find((ticket) => ticket.id === ticketId);
      if (!ticketToUpdate) return;

      const updatedTicket =
        userRole === "admin"
          ? { status: updates.status ?? ticketToUpdate.status }
          : { ...updates, status: ticketToUpdate.status };

      await UpdateTicket(ticketId, updatedTicket);
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, ...updatedTicket } : ticket
        )
      );
      Alert.alert("Ticket updated successfully.");
      setModalVisible(false);
    } catch (error) {
      setError("Failed to update ticket.");
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
          source={require("@/assets/images/partial-react-logo.png")}
          style={globalStyles.reactLogo}
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
                <DataTable.Title style={{ flex: 1 }}>
                  <ThemedText type="table">Actions</ThemedText>
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
                  <DataTable.Cell
                    style={{
                      flex: 1,
                      flexDirection: "row",
                    }}
                  >
                    {userRole === "user" ? (
                      <>
                        <IconButton
                          icon="pencil"
                          size={18}
                          iconColor={iconColor}
                          onPress={() => {
                            setEditingTicket(ticket);
                            setModalVisible(true);
                          }}
                        />
                        <IconButton
                          icon="delete"
                          size={18}
                          iconColor={iconColor}
                          onPress={() => handleTicketRemoval(ticket.id!)}
                        />
                      </>
                    ) : (
                      <>
                        <IconButton
                          icon="check"
                          size={18}
                          iconColor={iconColor}
                          onPress={() =>
                            handleTicketUpdate(ticket.id!, {
                              status: "completed",
                            })
                          }
                        />
                        <IconButton
                          icon="close"
                          size={18}
                          iconColor={iconColor}
                          onPress={() =>
                            handleTicketUpdate(ticket.id!, {
                              status: "rejected",
                            })
                          }
                        />
                      </>
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
      {modalVisible && editingTicket && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={modalStyles.container}>
            <ThemedView style={modalStyles.content}>
              <ThemedText type="title">Edit Ticket</ThemedText>
              <ThemedInput
                style={formStyles.input}
                value={editingTicket.title}
                onChangeText={(text) =>
                  setEditingTicket((prev) =>
                    prev ? { ...prev, title: text } : prev
                  )
                }
              />
              <ThemedTextArea
                style={formStyles.input}
                value={editingTicket.description}
                onChangeText={(text) =>
                  setEditingTicket((prev) =>
                    prev ? { ...prev, description: text } : prev
                  )
                }
              />
              <ThemedInput
                style={formStyles.input}
                value={moment(editingTicket.deadline).format(
                  "YYYY-MM-DD HH:mm"
                )}
                onChangeText={(text) =>
                  setEditingTicket((prev) =>
                    prev
                      ? {
                          ...prev,
                          deadline: moment(
                            text,
                            "YYYY-MM-DD HH:mm"
                          ).toISOString(),
                        }
                      : prev
                  )
                }
              />
              <TouchableOpacity
                style={formStyles.button}
                onPress={() =>
                  handleTicketUpdate(editingTicket.id!, editingTicket)
                }
              >
                <ThemedText style={formStyles.buttonText}>Save</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <ThemedText>Cancel</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </View>
        </Modal>
      )}
    </ParallaxScrollView>
  );
}
