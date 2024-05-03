import * as SecureStore from "expo-secure-store";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export const getDeviceUniqueId = async () => {
  try {
    let uuid = uuidv4();
    // await SecureStore.setItemAsync("secure_deviceid", "");     use for testing
    let fetchUUID = await SecureStore.getItemAsync("secure_deviceid");
    //if user has already signed up prior to this update, fetch the device id from the secure store
    if (fetchUUID) {
      uuid = fetchUUID;
    }
    await SecureStore.setItemAsync(
      "secure_deviceid",
      JSON.stringify(uuid.replaceAll(/\+/g, "").replaceAll(/"/g, ""))
    );
    return uuid;
  } catch (err) {
    console.error(err);
  }
};
