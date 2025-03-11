import axios from "axios";
import { GetAuthHeaders } from "./getAuthHeaders";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const API_VERSION = process.env.EXPO_PUBLIC_API_VERSION;

const apiRequest = async (
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  data?: any,
  withAuth: boolean = true
) => {
  try {
    const url = `${API_BASE_URL}/${API_VERSION}/${endpoint}`;
    const headers = withAuth ? GetAuthHeaders() : {};

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
