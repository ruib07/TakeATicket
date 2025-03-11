export const getApiUrl = (): string => {
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "";
  const API_VERSION = process.env.EXPO_PUBLIC_API_VERSION ?? "";

  if (!API_BASE_URL || !API_VERSION) {
    console.warn("API URL or API VERSION is not defined in .env");
  }

  return `${API_BASE_URL}/${API_VERSION}`;
};
