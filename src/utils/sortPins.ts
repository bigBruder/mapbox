import { VibesItem } from "../types/searchResponse";

export const sortPinsByWeightAndDate = (pins: VibesItem[]): VibesItem[] => {
  return [...pins].sort((a, b) => {
    const aWeight = a.points + (a.isTop ? 1 : 0);
    const bWeight = b.points + (b.isTop ? 1 : 0);

    if (aWeight !== bWeight) {
      return bWeight - aWeight;
    } else {
      return new Date(a.startsAt) - new Date(b.startsAt);
    }
  });
};
