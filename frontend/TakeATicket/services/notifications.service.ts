import { INotification } from "@/@types/notification";
import apiRequest from "./helpers/api.service";

export const GetNotifications = async () =>
  apiRequest("GET", "notifications", undefined, true);

export const GetNotificationById = async (notificationId: string) =>
  apiRequest("GET", `notifications/${notificationId}`, undefined, true);

export const CreateNotification = async (newNotification: INotification) =>
  apiRequest("POST", "notifications", newNotification, true);

export const MarkNotificationAsRead = async (notificationId: string) =>
  apiRequest(
    "PUT",
    `notifications/${notificationId}`,
    { status: "read" },
    true
  );

export const DeleteNotification = async (notificationId: string) =>
  apiRequest("DELETE", `notifications/${notificationId}`, undefined, true);
