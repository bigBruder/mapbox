import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { getLocationByIP } from "../utils/getLocationByIP";

const useRealTimeLocation = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    source: string;
  } | null>(null);
  const [permissionStatus, setPermissionStatus] = useState("undetermined");

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const fetchInitialLocation = async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        setPermissionStatus(status);

        if (status === "granted") {
          console.log(status);
          const initialLocation = await Location.getCurrentPositionAsync({});
          setLocation({
            latitude: initialLocation.coords.latitude,
            longitude: initialLocation.coords.longitude,
            source: "gps",
          });

          subscription = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              timeInterval: 5000, // Update every 5 seconds
              distanceInterval: 5, // Update every 5 meters
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
        console.error(err);
        console.error("Error fetching location:", err);
      }
    };

    console.log("location", location);

    // const checkPermissionStatus = async () => {
    //   console.log("Checking permission status");
    //   try {
    //     const { status } = await Location.getForegroundPermissionsAsync();
    //     await Location.requestForegroundPermissionsAsync();
    //     if (status !== permissionStatus) {
    //       setPermissionStatus(status);
    //       if (status === "granted") {
    //         fetchInitialLocation();
    //       } else if (status === "denied" || status === "undetermined") {
    //         const ipLocation = await getLocationByIP();
    //         setLocation(ipLocation);
    //       }
    //     }
    //   } catch (err) {
    //     console.error(err);
    //     console.error("Error checking permission status:", err);
    //   }
    // };

    fetchInitialLocation();
    // const intervalId = setInterval(checkPermissionStatus, 10000); // Check every 10 seconds

    return () => {
      if (subscription) {
        subscription.remove();
      }
      // clearInterval(intervalId);
    };
  }, [permissionStatus]);

  return { location, setPermissionStatus };
};

export default useRealTimeLocation;
