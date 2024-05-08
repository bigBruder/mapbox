import axios from "axios";
import { parseCSV } from "../utils/parseCsv";
import * as SecureStore from "expo-secure-store";

const BASE_URL_CONNECT = process.env.EXPO_PUBLIC_CONNECT_URL || "";
const SEARCH_BASE_URL = process.env.EXPO_PUBLIC_SEARCH_BASE_URL || "";

//breakpoints
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

export const searchPosts = async (props) => {
  // const params = new URLSearchParams();
  // // params.append("before", "2024-04-30Z");
  // // params.append("after", "2024-04-17Z");
  // params.append("location.latitude", props.latitude);
  // params.append("location.longitude", props.longitude);
  try {
    const access_token = await SecureStore.getItemAsync(
      "mapbox_secure_access_token"
    );
    if (!access_token) throw new Error("Access token not found");

    const url = "https://app-vibeapi-dev.azurewebsites.net/vibes/search";
    // const params = {
    //   before: "2024-04-30Z",
    //   after: "2024-04-17Z",
    //   "location.latitude": 40.0471767,
    //   "location.longitude": -75.0303379,
    //   radius: 3000,
    // };
    // const params = params;

    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    const { data } = await axios.get(breakpoints.POST_SEARCH, {
      props,
      headers,
    });
    return data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return null; // Return null or throw error as per your requirement
  }
};
