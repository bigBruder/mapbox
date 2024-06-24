import { useEffect, useState } from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocationByIp } from "@/utils/getLocationByIp";
import { ToastType, useToastStore } from "@/store/ToastStore";

const useRealTimeLocation = () => {
  const setToast = useToastStore((state) => state.setMessage);
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
              const newLocationParsed = {
                latitude: newLocation.coords.latitude,
                longitude: newLocation.coords.longitude,
                source: "gps",
              };
              const jsonNewLocationParsed = JSON.stringify(newLocationParsed);
              AsyncStorage.setItem("lastKnownLocation", jsonNewLocationParsed);
              setLocation(newLocationParsed);
            }
          );
        } else {
          const ipLocation = await getLocationByIp();
          if (ipLocation) {
            const jsonLastKnowLocation = JSON.stringify(ipLocation);
            await AsyncStorage.setItem(
              "lastKnownLocation",
              jsonLastKnowLocation
            );
            setLocation(ipLocation);
          } else {
            throw new Error();
          }
        }
      } catch (err) {
        const jsonLastKnownLocation = await AsyncStorage.getItem(
          "lastKnownLocation"
        );
        if (jsonLastKnownLocation) {
          const lastKnownLocation = JSON.parse(jsonLastKnownLocation);
          setLocation(lastKnownLocation);
        } else {
          setToast({
            message: "Unfornately, we couldn't get your location.",
            type: ToastType.ERROR,
          });
        }
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
