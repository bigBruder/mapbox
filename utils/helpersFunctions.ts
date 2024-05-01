import { DateType } from "react-native-ui-datepicker";
import dayjs from "dayjs";

export const formatDate = (date: DateType | null): string => {
    if (!date) return "";

    return dayjs(date).format("ddd, MMM DD");
  };