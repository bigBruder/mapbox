import { AuthData } from "@/types/responses/userResponse";
import * as SecureStore from "expo-secure-store";

export async function saveToSecureStore(key: string, value: any) {
  await SecureStore.setItemAsync(key, value);
}

export async function getFromSecureStore(key: string) {
  return await SecureStore.getItemAsync(key);
}

export async function setAuthData(authData: AuthData) {
  await saveToSecureStore("authData", JSON.stringify(authData));
}

export async function getAuthData() {
  const authData = await getFromSecureStore("authData");
  return authData ? JSON.parse(authData) : null;
}
