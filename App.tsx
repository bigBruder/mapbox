import { StyleSheet } from "react-native";
import Mapbox from "@rnmapbox/maps";
import { Map } from "./src/components/Map/Map";
import { MapContextProvider } from "./src/providers/mapContext/MapContext";
import { getAccessToken } from "./src/api/client";
import { getDeviceUniqueId } from "./src/providers/DeviceUniqueId";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import ToastManager, { Toast } from "toastify-react-native";
import { ToastType, useErrorStore } from "./src/store/ErrorStore";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_API_KEY || null);

export default function App() {
  const toast = useErrorStore((state) => state.toast);
  const setToast = useErrorStore((state) => state.setError);
  useEffect(() => {
    if (toast.message) {
      Toast[toast.type](toast.message, "bottom");
    }
    return () => {
      setToast({ message: "", type: ToastType.INFO });
    };
  }, [toast.message]);

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
      <ToastManager />
      <Map />
    </MapContextProvider>
  );
}

const styles = StyleSheet.create({});
