import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { getLocationByIp } from "@/utils/getLocationByIp";
import { ToastType, useErrorStore } from "@/store/ErrorStore";

const useRealTimeLocation = () => {
  const setToast = useErrorStore((state) => state.setError);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    source: string;
  } | null>(null);
  const [permissionStatus, setPermissionStatus] = useState("undetermined");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const fetchInitialLocation = async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
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
        } else {
          const ipLocation = await getLocationByIp();

          setLocation(ipLocation || null);
        }
      } catch (err) {
        setToast({
          message: "Unfornately, we couldn't get your location.",
          type: ToastType.ERROR,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialLocation();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [permissionStatus]);

  return { location, setPermissionStatus, isLoading };
};

export default useRealTimeLocation;
