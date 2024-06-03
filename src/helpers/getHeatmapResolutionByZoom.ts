export const getHeatmapResolutionByZoom = (zoom: number) => {
  return Math.min(zoom, 10) > 0 ? Math.round(Math.min(zoom, 10)) : 1;
};
