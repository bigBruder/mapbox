import axios from "axios";

export const getLocationByIP = async () => {
  try {
    const response = await axios.get("https://ipapi.co/json/");
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};
