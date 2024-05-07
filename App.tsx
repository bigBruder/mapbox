import { StyleSheet, NativeModules } from "react-native";
import Mapbox from "@rnmapbox/maps";
import { Map } from "./components/Map/Map";
import { MapContextProvider } from "./providers/MapContext";
import { getAccessToken } from "./api/client";
import { getDeviceUniqueId } from "./providers/DeviceUniqueId";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_API_KEY || null);

export default function App() {
  // useEffect(() => {
  //   console.log("App started");
  //   getDeviceUniqueId().then(async () => {
  //     getAccessToken();
  //   });
  // }, []);

  return (
    <MapContextProvider>
      <Map />
    </MapContextProvider>
  );
}

const styles = StyleSheet.create({});
