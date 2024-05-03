import axios from 'axios';
import { parseCSV } from '../utils/parseCsv';
const BASE_URL_CONNECT = process.env.EXPO_PUBLIC_CONNECT_URL || "";


export const getPoints = async () => {
    const {data} = await axios.get(process.env.EXPO_PUBLIC_SHEET_POINTS_LINK || "");
    return parseCSV(data);
};


export const getAccessToken = async () => {
    const {data} = await axios.post(BASE_URL_CONNECT, {
        grant_type: "client_credentials",
        client_id: process.env.EXPO_PUBLIC_CLIENT_ID,
        client_secret: process.env.EXPO_PUBLIC_CLIENT_SECRET,
        scope: "api"
    });
    return data;
}