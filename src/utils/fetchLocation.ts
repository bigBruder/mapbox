import * as Location from "expo-location";
import { getLocationByIP } from "./getLocationByIP";

export const fetchLocation = async () => {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    console.log("Location status:", status);
    let location = null;

    if (status !== "granted") {
      location = await getLocationByIP();
    } else {
      location = await Location.getCurrentPositionAsync({});
    }

    if (!location) return null;

    if (location?.source === "ip") {
      return location;
    }

    return {
      latitude: location?.coords.latitude,
      longitude: location?.coords.longitude,
      source: "gps",
    };
  } catch (error) {
    console.error("Error fetching location:", error);
    return null;
  }
};
