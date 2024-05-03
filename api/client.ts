import axios from 'axios';
import { parseCSV } from '../utils/parseCsv';

export const getPoints = async () => {
    const {data} = await axios.get(process.env.EXPO_PUBLIC_SHEET_POINTS_LINK || "");
    return parseCSV(data);
};