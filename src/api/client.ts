import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { MAP_FEATURES_TYPES } from "@/constants/map";
import { TopicsResponse } from "@/types/responses/MapTopicsResponse";
import { CellInfoResponse } from "@/types/responses/cellInfoResponse";
import { transformHeatmapResponseToHeatmapData } from "@/utils/transformDataToHeatData";
import { QueryParams, TransformedHeatmapData } from "@/types";
import { Vote } from "@/components/pulseInfo/PulseInfo";
import {
  AuthData,
  CreateUserResponse,
  User,
} from "@/types/responses/userResponse";

const BASE_URL = "http://pulse-dev-api.eastus.azurecontainer.io:8080";

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

export const getCellsVibes = async (
  queryParams: Partial<QueryParams>
): Promise<TopicsResponse | null> => {
  try {
    // console.log("queryParams", queryParams);
    const response = await axios.get(BASE_URL + "/map/top", {
      params: queryParams,
    });

    // console.log("response topics ==> ", response.data);
    // console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching cells vibes:", error);
    return null;
  }
};

export const getRegionInfo = async (area: number[], zoom: number) => {
  const baseUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places";
  const coords = area.join(",");

  try {
    const fields = MAP_FEATURES_TYPES.join(",");
    const response = await axios.get(
      `${baseUrl}/${coords}.json?access_token=${process.env.EXPO_PUBLIC_API_KEY}&types=${fields}`
    );
    // console.log("responseAPIGEO ==> ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching region info:", error);
    return null;
  }
};

export const getCellInfo = async (
  cellId: string
): Promise<CellInfoResponse | null> => {
  try {
    const response = await axios.get(BASE_URL + `/map/cell`, {
      params: {
        Id: cellId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching cell info:", error);
    return null;
  }
};

export const fetchTopicById = async (id: number) => {
  try {
    const response = await axios.get(BASE_URL + `/topics/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching topic by id:", error);
    return null;
  }
};

export const fetchHeatmap = async (
  queryParams: QueryParams
): Promise<TransformedHeatmapData | null> => {
  try {
    const response = await axios.get(BASE_URL + "/map/votes", {
      params: queryParams,
    });

    const transformedData = transformHeatmapResponseToHeatmapData(
      response.data
    );

    // console.log("transformedData", transformedData.features[0]);

    return transformedData;
  } catch (error) {
    console.error("Error fetching heatmap:", error);
    return null;
  }
};

export const publishVote = async (
  userId: string,
  topicId: string,
  location: { latitude: number; longitude: number },
  locationName: string
): Promise<Vote | null> => {
  try {
    const response = await axios.post(BASE_URL + "/votes", {
      userId,
      topicId,
      location,
      locationName,
    });
    return response.data;
  } catch (error) {
    console.error("Error publishing vote:", error);
    return null;
  }
};

export const fetchUserVotes = async (userId: string): Promise<Vote[] | []> => {
  try {
    const response = await axios.get(BASE_URL + "/votes/my", {
      params: {
        userId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user votes:", error);
    return [];
  }
};

export const fetchVoteByTopicId = async (
  userId: string,
  topicId: string
): Promise<Vote[] | null> => {
  try {
    const response = await axios.get(BASE_URL + "/votes/my", {
      params: {
        userId,
        topicId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching vote by topic id:", error);
    return null;
  }
};
export const fetchSettings = async () => {
  try {
    const response = await axios.get(BASE_URL + "/settings");
    return response.data;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
};

export const registerUserWithEmailAndPassword = async (
  email: string,
  password: string,
  userName: string
): Promise<CreateUserResponse | null> => {
  try {
    const response = await axios.post(
      BASE_URL + "/identity/create:withEmailAndPassword",
      {
        Email: email,
        Password: password,
        Name: userName,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    return null;
  }
};

export const loginUserWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<AuthData | null> => {
  try {
    const response = await axios.post(
      BASE_URL + "/identity/login:withEmailAndPassword",
      {
        email: email,
        password: password,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    return null;
  }
};

export const verifyUserWithToken = async (
  token: string
): Promise<User | null> => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await axios.get(BASE_URL + "/identity", {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying user:", error);
    return null;
  }
};
