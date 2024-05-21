export const getHeatmapResolutionByZoom = (zoom: number) => {
  switch (true) {
    case zoom < 1:
      return 4;
    case zoom >= 1 && zoom < 3:
      return 5;
    case zoom >= 3 && zoom < 6:
      return 6;
    case zoom >= 6 && zoom < 10:
      return 7;
    case zoom >= 10 && zoom < 15:
      return 8;
    case zoom >= 15:
      return 9;
    default:
      return 5;
  }
};
