import { INotification } from "@/@types/notification";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import {
  CreateNotification,
  GetNotificationsByAdmin,
  GetNotificationsByUser,
  MarkNotificationAsRead,
} from "@/services/notifications.service";
import { UpdateTicket } from "@/services/tickets.service";
import notificationStyles from "@/styles/notificationStyles";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [, setError] = useState<string | null>(null);
  const { userId, userRole } = useAuth();

  const fetchNotifications = async () => {
    if (!userId || !userRole) return;
    setLoading(true);

    try {
      const response =
        userRole === "admin"
          ? await GetNotificationsByAdmin(userId)
          : await GetNotificationsByUser(userId);

      setNotifications(response.data);
    } catch {
      setError("Failed to fetch notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userId, userRole]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications().finally(() => setRefreshing(false));
  }, []);

  const handleNotificationPress = async (notificationId: string) => {
    try {
      await MarkNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, status: "read" } : notif
        )
      );
    } catch {
      setError("Failed to mark notification as read.");
    }
  };

  const handleAction = async (
    notificationId: string,
    status: "accepted" | "rejected"
  ) => {
    try {
      const notification = notifications.find(
        (notif) => notif.id === notificationId
      );
      if (!notification) return;

      await UpdateTicket(notification.ticket_id, { status });

      if (userRole === "user") {
        const newNotification: INotification = {
          ticket_id: notification.ticket_id,
          user_id: notification.user_id,
          admin_id: notification.admin_id,
          content:
            status === "accepted"
              ? "Your ticket has been accepted"
              : "Your ticket has been rejected",
          status: "unread",
        };

        await CreateNotification(newNotification);
      }

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, status } : notif
        )
      );
    } catch {
      setError("Failed to update ticket status.");
    }
  };

  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          style={{ marginTop: 50 }}
          data={notifications}
          keyExtractor={(item) => item.id!.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <ThemedView style={notificationStyles.container}>
              <TouchableOpacity
                onPress={() => handleNotificationPress(item.id!)}
                disabled={item.status === "read"}
              >
                <ThemedText type="subtitle">{item.content}</ThemedText>
                <ThemedText
                  type="link"
                  style={{
                    color: item.status === "read" ? "gray" : "blue",
                    textDecorationLine:
                      item.status === "read" ? "line-through" : "none",
                  }}
                >
                  {item.status === "read" ? "Read" : "Mark as read"}
                </ThemedText>
              </TouchableOpacity>

              {userRole === "admin" && item.status === "pending" && (
                <ThemedView
                  style={{
                    flexDirection: "row",
                    marginTop: 10,
                  }}
                >
                  <Button
                    title="Accept"
                    color="green"
                    onPress={() => handleAction(item.id!, "accepted")}
                  />
                  <ThemedView style={{ width: 10 }} />
                  <Button
                    title="Reject"
                    color="red"
                    onPress={() => handleAction(item.id!, "rejected")}
                  />
                </ThemedView>
              )}

              {(item.status === "completed" ||
                item.status === "accepted" ||
                item.status === "rejected") && (
                <ThemedView style={{ marginTop: 10 }}>
                  <Button title="Done" color="gray" disabled />
                </ThemedView>
              )}
            </ThemedView>
          )}
        />
      )}
    </ThemedView>
  );
}
