export const getHeatmapResolutionByZoom = (zoom: number) => {
  switch (true) {
    case zoom < 1:
      return 5;
    case zoom >= 1 && zoom < 3:
      return 6;
    case zoom >= 3 && zoom < 6:
      return 7;
    case zoom >= 6 && zoom < 10:
      return 8;
    case zoom >= 10:
      return 10;
    default:
      return 10;
  }
};
