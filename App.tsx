import { StyleSheet, NativeModules } from "react-native";
import Mapbox from "@rnmapbox/maps";
import { Map } from "./components/Map/Map";
import { MapContextProvider } from "./providers/MapContext";
import { getDeviceUniqueId } from "./providers/DeviceUniqueId";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_API_KEY || null);

export default function App() {
  return (
    <MapContextProvider>
      <Map />
    </MapContextProvider>
  );
}

const styles = StyleSheet.create({});
