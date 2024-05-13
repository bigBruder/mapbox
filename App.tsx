import { StyleSheet } from "react-native";
import Mapbox from "@rnmapbox/maps";
import { Map } from "./src/components/Map/Map";
import { MapContextProvider } from "./src/providers/mapContext/MapContext";
import { getAccessToken } from "./src/api/client";
import { getDeviceUniqueId } from "./src/providers/DeviceUniqueId";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_API_KEY || null);

export default function App() {
  useEffect(() => {
    (async () => {
      const access_token = await SecureStore.getItemAsync(
        "mapbox_secure_access_token"
      );
      getDeviceUniqueId().then(async () => {
        getAccessToken();
      });
    })();
  }, []);

  return (
    <MapContextProvider>
      <Map />
    </MapContextProvider>
  );
}

const styles = StyleSheet.create({});
