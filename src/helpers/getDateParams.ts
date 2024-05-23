import { TransformToIsoDate } from "../utils/TransformToIsoDate";
import { queryParams } from "../types/queryParams";

export function getDateParams(
  selectedDate: string,
  customDate: {
    startDate: Date;
    endDate: Date;
  }
): Partial<queryParams> {
  const params: Partial<queryParams> = {};
  // console.log(selectedDate, TransformToIsoDate(selectedDate));
  if (selectedDate === "Custom") {
    if (customDate.startDate && customDate.endDate) {
      params.Before = customDate.endDate.toISOString();
      params.endsAfter = customDate.startDate.toISOString();
    }
  } else {
    params.Before = TransformToIsoDate(selectedDate).before;
    const selectedDatesArray = [
      "Next Month",
      "Now",
      "Today",
      "Next 7 Days",
      "Next 14 Days",
      "Next 30 Days",
    ];
    if (selectedDatesArray.includes(selectedDate)) {
      params.endsAfter = TransformToIsoDate(selectedDate).after;
    } else {
      params.After = TransformToIsoDate(selectedDate).after;
    }
  }

  return params;
}
