import { ITicket } from "@/@types/ticket";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedModal } from "@/components/ThemedModal";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextArea } from "@/components/ThemedTextArea";
import { ThemedView } from "@/components/ThemedView";
import { CreateTicket } from "@/services/tickets.service";
import { GetUsersByRole } from "@/services/users.service";
import formStyles from "@/styles/formStyles";
import globalStyles from "@/styles/globalStyles";
import { storage } from "@/utils/storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Button, Image, Platform, TouchableOpacity } from "react-native";

export default function TicketCreation() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [admin_id, setAdminId] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [admins, setAdmins] = useState<{ label: string; value: string }[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await storage.getItem("userId");
      setUserId(storedUserId);

      try {
        const response = await GetUsersByRole("admin");
        const adminOptions = response.data.map((admin: any) => ({
          label: admin.name,
          value: admin.id,
        }));
        setAdmins(adminOptions);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch admins.");
      }
    };

    fetchUserId();
  }, []);

  const handleTicketCreation = async () => {
    const newTicket: ITicket = {
      title,
      description,
      deadline: deadline!.toISOString(),
      status: "pending",
      user_id: userId!,
      admin_id,
    };

    try {
      await CreateTicket(newTicket);
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
          style={globalStyles.reactLogo}
        />
      }
    >
      <ThemedView style={globalStyles.container}>
        <ThemedText type="title" style={{ marginBottom: 10 }}>
          Create Ticket
        </ThemedText>
        <ThemedView style={formStyles.formField}>
          <ThemedInput
            onChangeText={setTitle}
            placeholder="Title"
            value={title}
          />
          <ThemedTextArea
            onChangeText={setDescription}
            placeholder="Description"
            value={description}
          />
          <Button
            title="Select Deadline"
            onPress={() => setShowDatePicker(true)}
          />

          {deadline && (
            <ThemedText style={{ marginVertical: 10 }}>
              Deadline: {deadline.toLocaleString()}
            </ThemedText>
          )}

          {showDatePicker && (
            <DateTimePicker
              value={deadline || new Date()}
              mode="datetime"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDeadline(selectedDate);
                }
              }}
            />
          )}
          <ThemedModal
            selectedValue={admin_id}
            onValueChange={(itemValue) => setAdminId(itemValue)}
            items={admins}
          />
          <TouchableOpacity
            style={formStyles.button}
            onPress={handleTicketCreation}
          >
            <ThemedText style={formStyles.buttonText}>Create</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}
