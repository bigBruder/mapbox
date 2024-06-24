import { CameraBound } from "@/types/CameraBound";
import { VibesItem } from "@/types/SearchResponse";
import { getDistanceBetweenPoints } from "./getDistanceBetween";

export const filterMarkers = (
  markers: VibesItem[],
  zoom: number,
  cameraBound: CameraBound | null
) => {
  if (!cameraBound) return markers;
  // const distanceFromCenterToNe = getDistanceBetweenPoints(
  //   cameraBound?.properties.center,
  //   cameraBound?.properties.bounds.ne
  // );

  return markers?.filter((marker) => {
    // const distanceToCenter = getDistanceBetweenPoints(
    //   cameraBound?.properties.center,
    //   [marker.venue.geo.longitude, marker.venue.geo.latitude]
    // );
    // if (distanceToCenter > distanceFromCenterToNe) return false;
    switch (true) {
      case zoom < 5:
        return marker.points >= 15;
      case zoom < 7:
        return marker.points >= 10;
      case zoom < 11:
        return marker.points >= 5;
      case zoom < 13:
        return marker.points >= 2;
      default:
        return true;
    }
  });
};

export const getPointsThreshold = (zoom: number): number => {
  switch (true) {
    case zoom < 5:
      return 15;
    case zoom < 7:
      return 10;
    case zoom < 11:
      return 5;
    case zoom < 13:
      return 2;
    default:
      return 0;
  }
};
