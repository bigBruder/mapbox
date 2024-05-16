import axios from "axios";
import { parseCSV } from "../utils/parseCsv";
import * as SecureStore from "expo-secure-store";
import { queryParams } from "../types/queryParams";

const BASE_URL_CONNECT = process.env.EXPO_PUBLIC_CONNECT_URL || "";
const SEARCH_BASE_URL = process.env.EXPO_PUBLIC_SEARCH_BASE_URL || "";

const breakpoints = {
  POST_SEARCH: `${SEARCH_BASE_URL}/vibes/search`,
};

const getAccessTokenFromStore = async () => {
  const access_token = await SecureStore.getItemAsync(
    "mapbox_secure_access_token"
  );
  if (!access_token) throw new Error("Access token not found");
  return access_token;
};

const fetchWithAuth = async (url: string, params: any = null) => {
  const access_token = await getAccessTokenFromStore();
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };

  const { data } = await axios.get(url, {
    params,
    headers,
  });

  return data;
};

export const getPoints = async () => {
  const { data } = await axios.get(
    process.env.EXPO_PUBLIC_SHEET_POINTS_LINK || ""
  );
  return parseCSV(data);
};

export const getAccessToken = async () => {
  try {
    const device_id = await SecureStore.getItemAsync("mapbox_secure_deviceid");
    if (!device_id) throw new Error("Device ID not found");

    const params = new URLSearchParams();
    params.append("device_id", device_id);
    params.append("grant_type", "device_id");

    const { data } = await axios.post(
      `${BASE_URL_CONNECT}/connect/token`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${process.env.EXPO_PUBLIC_API_ACCESS_TOKEN}`,
        },
      }
    );

    await SecureStore.setItemAsync(
      "mapbox_secure_access_token",
      data.access_token
    );
    return data.access_token;
  } catch (error) {
    console.error("Error fetching access token:", error);
    return null;
  }
};

export const searchPosts = async (queryParams: queryParams) => {
  try {
    return await fetchWithAuth(`${SEARCH_BASE_URL}/vibes/search`, queryParams);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return null;
  }
};

export const getVibeDetails = async (id: string) => {
  try {
    return await fetchWithAuth(`${SEARCH_BASE_URL}/vibes/${id}`);
  } catch (error) {
    console.error("Error fetching vibe details:", error);
    return null;
  }
};

export const getPinsForBound = async (queryParams: queryParams) => {
  try {
    return await fetchWithAuth(`${SEARCH_BASE_URL}/vibes/search`, queryParams);
  } catch (error) {
    console.error("Error fetching pins for bound:", error);
    return null;
  }
};
