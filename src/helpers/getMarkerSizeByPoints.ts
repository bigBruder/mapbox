const MAX_SIZE = 25;
const MIN_SIZE = 15;

const interpolateSize = (
  zoom: number,
  minZoom = 1,
  maxZoom = 20,
  minSize: number,
  maxSize: number,
  sizeAdjustment = 0
) => {
  if (zoom < minZoom) {
    zoom = minZoom;
  } else if (zoom > maxZoom) {
    zoom = maxZoom;
  }

  const size =
    minSize +
    ((maxSize - minSize) * (zoom - minZoom)) / (maxZoom - minZoom) +
    sizeAdjustment;
  return size;
};

export const getMarkerSizeByPoints = (points: number, zoom: number) => {
  let sizeAdjustment;

  if (points < 5) {
    sizeAdjustment = 0;
  } else if (points >= 5 && points < 10) {
    sizeAdjustment = 5;
  } else if (points >= 10) {
    sizeAdjustment = 15;
  } else {
    sizeAdjustment = 0;
  }

  return interpolateSize(zoom, 1, 20, MIN_SIZE, MAX_SIZE, sizeAdjustment);
};
