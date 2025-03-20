import { INotification } from "@/@types/notification";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import {
  GetNotificationsByAdmin,
  GetNotificationsByUser,
  MarkNotificationAsRead,
} from "@/services/notifications.service";
import notificationStyles from "@/styles/notificationStyles";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
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
            </ThemedView>
          )}
        />
      )}
    </ThemedView>
  );
}
