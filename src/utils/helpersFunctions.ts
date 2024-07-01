import { DateType } from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { getIconUrl } from "./getIconUrl";
import { VibesItem } from "@/types/SearchResponse";
import { Image } from "react-native";

export const formatDate = (date: DateType | null): string => {
  if (!date) return "";

  return dayjs(date).format("ddd, MMM DD");
};

export const transformPinsToImagesForMap = (
  pins: VibesItem[]
): { [key: string]: { uri: string } } => {
  const idsAdded: string[] = [];
  return pins.reduce((acc, pin) => {
    if (idsAdded.includes(pin.icon)) return acc;
    acc[pin.icon.replace("id:", "")] = {
      uri: getIconUrl(pin.icon),
    };
    idsAdded.push(pin.icon);

    return acc;
  }, {} as { [key: string]: { uri: string } });
};
