import { StyleSheet, NativeModules } from "react-native";
import Mapbox from "@rnmapbox/maps";
import { Map } from "./components/Map/Map";
import { MapContextProvider } from "./providers/MapContext";
import { getAccessToken } from "./api/client";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_API_KEY || null);

export default function App() {
  getAccessToken();
  return (
    <MapContextProvider>
      <Map />
    </MapContextProvider>
  );
}

const styles = StyleSheet.create({});
