export const getFrameId = (isAlreadyStarted: boolean, isSelected: boolean) => {
  if (!isAlreadyStarted && !isSelected) return "frame";
  if (isAlreadyStarted && !isSelected) return "frameStarted";
  if (!isSelected && isSelected) return "frameSelected";
  if (isAlreadyStarted && isSelected) return "frameSelectedStarted";
  return "frame";
};

// export const getGridIndex = (zoom: number) => {
//   return Math.min(zoom, 10) > 3 ? Math.round(Math.min(zoom, 10)) : 3;
// };

export function getGridIndex(zoomLevel: number): number {
  const minZoom = 0;
  const maxZoom = 13;

  const minGridIndex = 1;
  const maxGridIndex = 9;
  if (zoomLevel < minZoom) zoomLevel = minZoom;
  if (zoomLevel > maxZoom) zoomLevel = maxZoom;

  const gridIndex =
    minGridIndex +
    ((zoomLevel - minZoom) * (maxGridIndex - minGridIndex)) /
      (maxZoom - minZoom);

  return gridIndex;
}
