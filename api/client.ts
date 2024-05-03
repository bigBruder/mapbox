import axios from "axios";
import { parseCSV } from "../utils/parseCsv";

const BASE_URL_CONNECT = process.env.EXPO_PUBLIC_CONNECT_URL || "";

export const getPoints = async () => {
  const { data } = await axios.get(
    process.env.EXPO_PUBLIC_SHEET_POINTS_LINK || ""
  );
  return parseCSV(data);
};

export const getAccessToken = async () => {
  try {
    const params = new URLSearchParams();
    params.append("device_id", "000999");
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
    return data.access_token;
  } catch (error) {
    console.error("Error fetching access token:", error);
  }
};
