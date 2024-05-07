import * as SecureStore from "expo-secure-store";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import * as Application from "expo-application";
import { Platform } from "react-native";

export const getDeviceUniqueId = async () => {
  let uniqueId;
  try {
    // let uuid = uuidv4();
    // // await SecureStore.setItemAsync("secure_deviceid", "");     use for testing
    // let fetchUUID = await SecureStore.getItemAsync("mapbox_secure_deviceid");
    // console.log("fetched uuid: ", fetchUUID);
    // //if user has already signed up prior to this update, fetch the device id from the secure store
    // if (fetchUUID) {
    //   uuid = fetchUUID;
    // }
    // await SecureStore.setItemAsync(
    //   "mapbox_secure_deviceid",
    //   JSON.stringify(uuid.replaceAll(/\+/g, "").replaceAll(/"/g, ""))
    // );
    // console.log("Device ID:   ", uuid);
    // return uuid;
    if (Platform.OS === "ios") {
      uniqueId = await Application.getIosIdForVendorAsync();
    }

    if (Platform.OS === "android") {
      uniqueId = await Application.getAndroidId();
    }

    console.log("Device ID:   ", uniqueId);
    return uniqueId;
  } catch (err) {
    console.error(err);
  }
};
