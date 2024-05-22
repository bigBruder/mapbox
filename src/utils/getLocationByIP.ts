import axios from "axios";
import { Platform } from "react-native";
import * as Network from "expo-network";

export const getLocationByIP = async () => {
  try {
    if (Platform.OS === "ios") {
      const { data } = await axios.get("https://api.ipify.org?format=json");
      const response = await axios.get(
        `https://freeipapi.com/api/json/${data.ip}`
      );
      return {
        longitude: response.data.longitude,
        latitude: response.data.latitude,
        source: "ip",
      };
    }

    if (Platform.OS === "android") {
      const { data } = await axios.get("http://ip-api.com/json/");
      return {
        longitude: data.lon,
        latitude: data.lat,
        source: "ip",
      };
    }
  } catch (e) {
    console.error("Error fetching location by IP:", e);
    return null;
  }
};
