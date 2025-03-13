import { storage } from "@/utils/storage";

export async function GetAuthHeaders() {
  const token = await storage.getItem("token");

  if (!token) return;

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}
