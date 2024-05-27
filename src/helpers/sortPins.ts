import { VibesItem } from "../types/searchResponse";

export function sortPinsByWeightAndDate(pins: VibesItem[]) {
  return [...pins].sort((a, b) => {
    if (a.points !== b.points) {
      return a.points - b.points;
    }

    if (a.startsAt > b.startsAt) {
      return -1;
    } else if (a.startsAt < b.startsAt) {
      return 1;
    }

    if (a.createdAt > b.createdAt) {
      return -1;
    } else if (a.createdAt < b.createdAt) {
      return 1;
    } else {
      return 0;
    }
  });
}
