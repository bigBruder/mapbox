export const getHeatmapResolutionByZoom = (zoom: number) => {
  return Math.min(zoom, 10) > 3 ? Math.round(Math.min(zoom, 10)) : 3;
};
