import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

const apiRequest = async (method: "PUT", endpoint: string, data?: any) => {
  try {
    const url = `${API_BASE_URL}/${API_VERSION}/${endpoint}`;

    const response = await axios({
      method,
      url,
      data,
    });

    return response;
  } catch {
    throw new Error(`Failed to ${method} ${endpoint}`);
  }
};

export default apiRequest;
