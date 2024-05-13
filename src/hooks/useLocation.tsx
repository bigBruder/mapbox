import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { locationManager } from "@rnmapbox/maps";

const useLocation = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    source: string;
  } | null>(null);
  const [status, setStatus] = useState<Location.LocationProviderStatus | null>(
    null
  );

  useEffect(() => {
    const fetchLocation = async () => {
      // console.log("statusGps", statusGps);
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        // alert("Permission to access location was denied");
        return;
      }

      setStatus(status);

      let location = await Location.getCurrentPositionAsync({
        // accuracy: Location.Accuracy.High,
      });
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        source: "gps",
      });
    };

    fetchLocation();

    return () => {
      // Clean up if needed
    };
  }, []);

  return location;
};

export default useLocation;
