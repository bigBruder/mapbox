import axios from "axios";
import * as Network from "expo-network";

export const getLocationByIP = async () => {
  try {
    const { data } = await axios.get("https://api.ipify.org?format=json");
    const response = await axios.get(
      `https://freeipapi.com/api/json/${data.ip}`
    );
    return {
      longitude: response.data.longitude,
      latitude: response.data.latitude,
      source: "ip",
    };
  } catch (e) {
    console.error("Error fetching location by IP:", e);
    return null;
  }
};
