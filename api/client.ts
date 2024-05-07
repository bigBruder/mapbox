import axios from "axios";
import { parseCSV } from "../utils/parseCsv";
import * as SecureStore from "expo-secure-store";

const BASE_URL_CONNECT = process.env.EXPO_PUBLIC_CONNECT_URL || "";

export const getPoints = async () => {
  const { data } = await axios.get(
    process.env.EXPO_PUBLIC_SHEET_POINTS_LINK || ""
  );
  return parseCSV(data);
};

export const getAccessToken = async () => {
  try {
    const device_id = await SecureStore.getItemAsync("mapbox_secure_deviceid");
    if (!device_id) throw new Error("Device ID not found");
    console.log("Device ID API:   ", device_id);
    const params = new URLSearchParams();
    params.append("device_id", device_id);
    params.append("grant_type", "device_id");
    const { data } = await axios.post(
      "https://app-vibeidsrv-dev.azurewebsites.net/connect/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${process.env.EXPO_PUBLIC_API_ACCESS_TOKEN}`,
        },
      }
    );
    SecureStore.setItemAsync("mapbox_secure_access_token", data.access_token);
    return data.access_token;
  } catch (error) {
    console.error("Error fetching access token:", error);
  }
};
