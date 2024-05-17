// queryBuilder.ts

import { CameraBound } from "../types/CameraBound";
import { TransformToIsoDate } from "../utils/TransformToIsoDate";
import { queryParams } from "../types/queryParams";

export const queryParamsBuilder = (
  cameraBound: CameraBound,
  selectedTag: string | null,
  selectedDate: string,
  customDate: { startDate: Date; endDate: Date }
): queryParams => {
  const { ne, sw } = cameraBound.properties.bounds;
  const queryParams: queryParams = {
    "NE.Latitude": sw[1],
    "NE.Longitude": sw[0],
    "SW.Latitude": ne[1],
    "SW.Longitude": ne[0],
    OrderBy: "Points",
    PageSize: cameraBound.properties.zoom > 15 ? 15 : 10,
    IncludeTotalCount: true,
    "TopTags.Enable": true,
    "Heatmap.Enable": true,
    "Heatmap.Resolution": cameraBound.properties.zoom > 10 ? 9 : 8,
  };
  if (selectedTag) {
    queryParams["Tags"] = selectedTag;
  }

  if (selectedDate === "Custom") {
    if (customDate.startDate && customDate.endDate) {
      queryParams.Before = customDate.endDate.toISOString();
      queryParams.endsAfter = customDate.startDate.toISOString();
    }
  } else {
    queryParams.Before = TransformToIsoDate(selectedDate).before;
    if (
      selectedDate === "Next Month" ||
      selectedDate === "Now" ||
      selectedDate === "Today" ||
      selectedDate === "Next 7 Days" ||
      selectedDate === "Next 14 Days" ||
      selectedDate === "Next 30 Days"
    ) {
      queryParams.endsAfter = TransformToIsoDate(selectedDate).after;
    } else {
      queryParams.After = TransformToIsoDate(selectedDate).after;
    }
  }
  return queryParams;
};
