import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Mapbox from "@rnmapbox/maps";
import { Map } from "@/components/Map/Map";
import { MapContextProvider } from "@/providers/mapContext/MapContext";
import { getAccessToken } from "@/api/client";
import { getDeviceUniqueId } from "@/providers/DeviceUniqueId";
import * as SecureStore from "expo-secure-store";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_API_KEY || null);

export default function App() {
  useEffect(() => {
    (async () => {
      try {
        const access_token = await SecureStore.getItemAsync(
          "mapbox_secure_access_token"
        );
        getDeviceUniqueId().then(async () => {
          getAccessToken();
        });
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <MapContextProvider>
      <Map />
    </MapContextProvider>
  );
}

const styles = StyleSheet.create({});
