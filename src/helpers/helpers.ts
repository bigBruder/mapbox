import {
  MAX_HEATMAP_RESOLUTION,
  MIN_HEATMAP_RESOLUTION,
} from "@/constants/heatmapConfig";

const MIN_ZOOM = 0;
const MAX_ZOOM = 13;
const MIN_GRID_INDEX = 0;
const MAX_GRID_INDEX = 9;

export const getFrameId = (isAlreadyStarted: boolean, isSelected: boolean) => {
  if (isAlreadyStarted && isSelected) return "frameSelectedStarted";
  if (isAlreadyStarted) return "frameStarted";
  if (isSelected) return "frameSelected";
  return "frame";
};

export function getGridIndex(zoomLevel: number): number {
  const roundedZoomLevel = Math.floor(zoomLevel);
  zoomLevel = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, roundedZoomLevel));
  return Math.round(
    MIN_GRID_INDEX +
      ((roundedZoomLevel - MIN_ZOOM) * (MAX_GRID_INDEX - MIN_GRID_INDEX)) /
        (MAX_ZOOM - MIN_ZOOM)
  );
}
export function getHeatmapResolutionByZoom(zoomLevel: number) {
  zoomLevel = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomLevel));
  return Math.round(
    MIN_HEATMAP_RESOLUTION +
      ((zoomLevel - MIN_ZOOM) *
        (MAX_HEATMAP_RESOLUTION - MIN_HEATMAP_RESOLUTION)) /
        (MAX_ZOOM - MIN_ZOOM)
  );
}
