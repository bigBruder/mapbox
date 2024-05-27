import * as SecureStore from "expo-secure-store";
import "react-native-get-random-values";
import * as Application from "expo-application";
import { Platform } from "react-native";

export const getDeviceUniqueId = async () => {
  let uniqueId;
  try {
    if (Platform.OS === "ios") {
      uniqueId = await Application.getIosIdForVendorAsync();

      if (!uniqueId) {
        setTimeout(async () => {
          // from docs: This method may sometimes return `nil`, in which case wait and call the method again later.
          uniqueId = await Application.getIosIdForVendorAsync();
        }, 5000);
      }
    }

    if (Platform.OS === "android") {
      uniqueId = await Application.getAndroidId();
    }

    await SecureStore.setItemAsync(
      "mapbox_secure_deviceid",
      uniqueId || "unset"
    );
  } catch (err) {
    console.error(err);
  }
};
