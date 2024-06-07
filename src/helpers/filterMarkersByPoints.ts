import { VibesItem } from "../types/searchResponse";

export const filterMarkersByPoints = (markers: VibesItem[], zoom: number) => {
  return markers?.filter((marker) => {
    switch (true) {
      case zoom < 5:
        return marker.points >= 15;
      case zoom < 7:
        return marker.points >= 10;
      case zoom < 9:
        return marker.points >= 5;
      case zoom < 11:
        return marker.points >= 3;
      case zoom < 13:
        return marker.points >= 2;
      default:
        return true;
    }
  });
};
