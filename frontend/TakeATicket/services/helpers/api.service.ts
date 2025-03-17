import axios from "axios";
import { GetAuthHeaders } from "./getAuthHeaders";
import { Platform } from "react-native";

const isWeb = Platform.OS === "web";

const API_BASE_URL = isWeb
  ? "http://localhost:3005"
  : process.env.EXPO_PUBLIC_API_BASE_URL;
const API_VERSION = process.env.EXPO_PUBLIC_API_VERSION;

const apiRequest = async (
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  data?: any,
  withAuth: boolean = true
) => {
  try {
    const url = `${API_BASE_URL}/${API_VERSION}/${endpoint}`;
    const headers = withAuth ? await GetAuthHeaders() : {};

    const response = await axios({
      method,
      url,
      data,
      headers,
    });

    return response;
  } catch {
    throw new Error(`Failed to ${method} ${endpoint}`);
  }
};

export default apiRequest;
