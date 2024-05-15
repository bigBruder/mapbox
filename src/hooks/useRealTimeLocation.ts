import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { getLocationByIP } from "../utils/getLocationByIP";

const useRealTimeLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState("undetermined");

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const fetchInitialLocation = async () => {
      try {
        // Request permissions instead of just checking them
        const { status } = await Location.requestForegroundPermissionsAsync();

        // Update permission status
        setPermissionStatus(status);

        if (status === "granted") {
          const initialLocation = await Location.getCurrentPositionAsync({});
          setLocation({
            latitude: initialLocation.coords.latitude,
            longitude: initialLocation.coords.longitude,
            source: "gps",
          });

          subscription = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              timeInterval: 5000, // Update every 10 seconds
              distanceInterval: 5, // Update every 10 meters
            },
            (newLocation) => {
              setLocation({
                latitude: newLocation.coords.latitude,
                longitude: newLocation.coords.longitude,
                source: "gps",
              });
            }
          );
        } else if (status === "denied" || status === "undetermined") {
          const ipLocation = await getLocationByIP();
          setLocation(ipLocation);
        }
      } catch (err) {
        setError(err);
        console.error("Error fetching location:", err);
      }
    };

    fetchInitialLocation();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [permissionStatus]);

  return { location, error, setPermissionStatus };
};

export default useRealTimeLocation;
