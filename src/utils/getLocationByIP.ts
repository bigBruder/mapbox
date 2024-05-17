import axios from "axios";
import * as Network from "expo-network";

export const getLocationByIP = async () => {
  try {
    const ip = await Network.getIpAddressAsync();
    console.log("IP:", ip);
    const response = await axios.get(`http://ip-api.com/json/`);
    console.log("Location by IP:", response.data);
    // console.log("Location by IP:", response.data);
    return {
      longitude: response.data.lon,
      latitude: response.data.lat,
      source: "ip",
    };
  } catch (e) {
    console.error("Error fetching location by IP:", e);
    return null;
  }
};
