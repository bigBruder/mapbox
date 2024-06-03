import axios from "axios";
import { parseCSV } from "../utils/parseCsv";
import * as SecureStore from "expo-secure-store";
import { queryParams } from "../types/queryParams";
import cheerio from "cheerio";
import { getFeatureTypeByZoom } from "../helpers/getFeatureTypeByZoom";

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
  let access_token = await getAccessTokenFromStore();
  let headers = {
    Authorization: `Bearer ${access_token}`,
  };

  try {
    const { data } = await axios.get(url, {
      params,
      headers,
    });
    return data;
  } catch (error) {
    // @ts-ignore
    if (error.response && error.response.status === 401) {
      access_token = await getAccessToken();
      if (access_token) {
        headers.Authorization = `Bearer ${access_token}`;
        const { data } = await axios.get(url, {
          params,
          headers,
        });
        return data;
      } else {
        throw new Error("Unable to refresh access token");
      }
    } else {
      throw error;
    }
  }
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

export const getPinsForBound = async (queryParams: Partial<queryParams>) => {
  try {
    return await fetchWithAuth(`${SEARCH_BASE_URL}/vibes/search`, queryParams);
  } catch (error) {
    console.error("Error fetching pins for bound:", error);
    return null;
  }
};

export const getWebPageMeta = async (url: string) => {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const meta = {};
    $("meta").each((i, elem) => {
      const name = $(elem).attr("name") || $(elem).attr("property");
      const content = $(elem).attr("content");
      if (name) {
        meta[name] = content;
      }
    });
    if (meta && meta["og:title"].includes("Log in or sign")) return null;
    return meta;
  } catch (error) {
    console.error("Error fetching metadata:", error);
  }
};

export const getHeatmap = async (
  queryParams: Pick<
    queryParams,
    | "NE.Latitude"
    | "NE.Longitude"
    | "SW.Latitude"
    | "SW.Longitude"
    | "Heatmap.Resolution"
  >
) => {
  const baseParams = {
    "Heatmap.Enable": true,
    PageSize: 0,
  };
  const pageSize = 0;
  try {
    return await fetchWithAuth(`${SEARCH_BASE_URL}/vibes/search`, {
      ...baseParams,
      ...queryParams,
    });
  } catch (error) {
    console.error("Error fetching heatmap:", error);
    return null;
  }
};

export const getRegionInfo = async (area: number[], zoom: number) => {
  console.log("work");
  const baseUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places";
  const coords = area.reverse().join(",");

  try {
    const field = getFeatureTypeByZoom(zoom);

    const response = await axios.get(
      `${baseUrl}/${coords}.json?access_token=${process.env.EXPO_PUBLIC_API_KEY}&types=country,region,district,place,locality,neighborhood`
    );

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching region info:", error);
    return null;
  }
};
