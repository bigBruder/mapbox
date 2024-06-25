import { DateType } from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { getIconUrl } from "./getIconUrl";
import { VibesItem } from "@/types/SearchResponse";

export const formatDate = (date: DateType | null): string => {
  if (!date) return "";

  return dayjs(date).format("ddd, MMM DD");
};

export const transformPinsToImagesForMap = (
  pins: VibesItem[]
): { [key: string]: { uri: string } } => {
  return pins.reduce((acc, pin) => {
    acc[pin.icon.replace("id:", "")] = {
      uri: getIconUrl(pin.icon),
    };

    return acc;
  }, {} as { [key: string]: { uri: string } });
};
