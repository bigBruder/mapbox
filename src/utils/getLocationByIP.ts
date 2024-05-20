import axios from "axios";
import * as Network from "expo-network";

export const getLocationByIP = async () => {
  try {
    // const ip = await Network.getIpAddressAsync();
    // const publicIp = await Network.getNetworkStateAsync();
    // console.log(publicIp);
    const { data } = await axios.get("https://api.ipify.org?format=json");
    // console.log(data.ip);
    // console.log("IP:", ip);
    // console.log("IP by IPify:", data);
    const response = await axios.get(`http://ip-api.com/json/${data.ip}`);
    // console.log("Location by IP:", response.data);
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
