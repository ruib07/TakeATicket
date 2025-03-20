import { INotification } from "@/@types/notification";
import { ITicket } from "@/@types/ticket";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextArea } from "@/components/ThemedTextArea";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import { CreateNotification } from "@/services/notifications.service";
import { GetTicketById, UpdateTicket } from "@/services/tickets.service";
import formStyles from "@/styles/formStyles";
import globalStyles from "@/styles/globalStyles";
import modalStyles from "@/styles/modalStyles";
import { useSearchParams } from "expo-router/build/hooks";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { Alert, Image, Modal, TouchableOpacity, View } from "react-native";

export default function TicketDetailsScreen() {
  const [ticket, setTicket] = useState<ITicket | null>(null);
  const [editingTicket, setEditingTicket] = useState<ITicket | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const searchParams = useSearchParams();
  const { userRole } = useAuth();

  useEffect(() => {
    const fetchTicket = async () => {
      const id = searchParams.get("id");
      if (!id) return;
      const response = await GetTicketById(id);
      setTicket(response.data);
    };
    fetchTicket();
  }, [searchParams]);

  const handleTicketUpdate = async () => {
    if (!editingTicket) return;

    try {
      await UpdateTicket(editingTicket.id!, editingTicket);

      setTicket(editingTicket);
      setModalVisible(false);
      Alert.alert("Ticket updated successfully.");
    } catch {
      Alert.alert("Error updating ticket.");
    }
  };

  const handleAdminCompleteTicket = async () => {
    if (!ticket) return;

    try {
      const updatedTicket = { ...ticket, status: "completed" };

      await UpdateTicket(ticket.id!, updatedTicket);

      const newNotification: INotification = {
        ticket_id: ticket.id!,
        user_id: ticket.user_id,
        admin_id: ticket.admin_id,
        content: "Your ticket has been completed",
        status: "unread",
      };
      await CreateNotification(newNotification);

      setTicket(updatedTicket);
      Alert.alert("Ticket marked as completed.");
    } catch {
      Alert.alert("Error completing ticket.");
    }
  };

  if (!ticket) {
    return <ThemedText type="title">Loading...</ThemedText>;
  }

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
        <ThemedText type="title" style={{ marginBottom: 5 }}>
          {ticket.title}
        </ThemedText>
        <ThemedView style={{ flexDirection: "row", marginBottom: 5 }}>
          <ThemedText type="defaultSemiBold">Status: </ThemedText>
          <ThemedText type="default">{ticket.status}</ThemedText>
        </ThemedView>
        <ThemedView style={{ flexDirection: "row", marginBottom: 5 }}>
          <ThemedText type="defaultSemiBold">Description: </ThemedText>
          <ThemedText type="default">{ticket.description}</ThemedText>
        </ThemedView>
        <ThemedView style={{ flexDirection: "row" }}>
          <ThemedText type="defaultSemiBold">Deadline: </ThemedText>
          <ThemedText type="default">
            {moment(ticket.deadline).format("DD/MM-HH:mm")}
          </ThemedText>
        </ThemedView>

        {userRole === "user" ? (
          <TouchableOpacity
            style={formStyles.button}
            onPress={() => {
              setEditingTicket(ticket);
              setModalVisible(true);
            }}
          >
            <ThemedText style={formStyles.buttonText}>Update Ticket</ThemedText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              formStyles.button,
              (ticket.status === "completed" ||
                ticket.status === "rejected") && {
                backgroundColor: "gray",
              },
            ]}
            onPress={handleAdminCompleteTicket}
            disabled={
              ticket.status === "completed" || ticket.status === "rejected"
            }
          >
            <ThemedText style={formStyles.buttonText}>
              Complete Ticket
            </ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>

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
                onPress={handleTicketUpdate}
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
