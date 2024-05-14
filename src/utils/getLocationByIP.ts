import axios from "axios";

export const getLocationByIP = async () => {
  try {
    const response = await axios.get("http://ip-api.com/json/");
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
