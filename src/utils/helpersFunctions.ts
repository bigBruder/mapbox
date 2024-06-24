import { DateType } from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { getIconUrl } from "./getIconUrl";
import { VibesItem } from "@/types/SearchResponse";

export const formatDate = (date: DateType | null): string => {
  if (!date) return "";

  return dayjs(date).format("ddd, MMM DD");
};

export const transformPinsToImagesForMap = (pins: VibesItem[]) => {
  return pins.reduce((acc, pin) => {
    // @ts-ignore
    acc[pin.icon.replace("id:", "")] = {
      uri: getIconUrl(pin.icon),
    };
    return acc;
  }, {});
};
