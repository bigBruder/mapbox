import axios from "axios";
import { parseCSV } from "../utils/parseCsv";
import * as SecureStore from "expo-secure-store";
import { PostDetailsResponse } from "../types/responses/PostDetailsResponse";
import { queryParams } from "../types/queryParams";

const BASE_URL_CONNECT = process.env.EXPO_PUBLIC_CONNECT_URL || "";
const SEARCH_BASE_URL = process.env.EXPO_PUBLIC_SEARCH_BASE_URL || "";

const breakpoints = {
  POST_SEARCH: `${SEARCH_BASE_URL}/vibes/search`,
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
      "https://app-vibeidsrv-dev.azurewebsites.net/connect/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${process.env.EXPO_PUBLIC_API_ACCESS_TOKEN}`,
        },
      }
    );
    SecureStore.setItemAsync("mapbox_secure_access_token", data.access_token);
    return data.access_token;
  } catch (error) {
    console.error("Error fetching access token:", error);
  }
};
export const searchPosts = async (queryParams: queryParams) => {
  try {
    const access_token = await SecureStore.getItemAsync(
      "mapbox_secure_access_token"
    );
    if (!access_token) throw new Error("Access token not found");

    const url = "https://app-vibeapi-dev.azurewebsites.net/vibes/search";

    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    const { data } = await axios.get(url, {
      params: queryParams,
      headers: headers,
    });

    return data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return null;
  }
};

export const getVibeDetails = async (id: string) => {
  try {
    const access_token = await SecureStore.getItemAsync(
      "mapbox_secure_access_token"
    );
    if (!access_token) throw new Error("Access token not found");

    const url = `https://app-vibeapi-dev.azurewebsites.net/vibes/${id}`;

    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    const { data } = await axios.get(url, {
      headers,
    });
    return data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return null;
  }
};

export const getPinsForBound = async (queryParams: queryParams) => {
  try {
    const access_token = await SecureStore.getItemAsync(
      "mapbox_secure_access_token"
    );
    if (!access_token) throw new Error("Access token not found");

    const url = "https://app-vibeapi-dev.azurewebsites.net/vibes/search";

    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    const { data } = await axios.get(url, {
      params: queryParams,
      headers: headers,
    });

    return data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return null;
  }
};
