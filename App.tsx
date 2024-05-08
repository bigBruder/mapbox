import { StyleSheet, NativeModules } from "react-native";
import Mapbox from "@rnmapbox/maps";
import { Map } from "./components/Map/Map";
import { MapContextProvider } from "./providers/MapContext";
import { getAccessToken, searchPosts } from "./api/client";
import { getDeviceUniqueId } from "./providers/DeviceUniqueId";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_API_KEY || null);

export default function App() {
  useEffect(() => {
    (async () => {
      const access_token = await SecureStore.getItemAsync(
        "mapbox_secure_access_token"
      );
      // console.log("access => ", access_token);
      if (access_token) return;
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
