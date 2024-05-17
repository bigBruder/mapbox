import axios from "axios";
import * as Network from "expo-network";

export const getLocationByIP = async () => {
  try {
    const { data } = await axios.get("https://api.ipify.org?format=json");
    console.log(data.ip);
    const response = await axios.get(
      `https://api.ipgeolocation.io/ipgeo?apiKey=003f7ab49a5d466db6ddca5571c0b6d1&ip=${data.ip}`
    );
    console.log(
      response.data.latitude,
      response.data.longitude,
      typeof response.data.latitude,
      typeof response.data.longitude
    );
    return {
      longitude: +response.data.latitude,
      latitude: +response.data.longitude,
      source: "ip",
    };
  } catch (e) {
    console.error("Error fetching location by IP:", e);
    return null;
  }
};
