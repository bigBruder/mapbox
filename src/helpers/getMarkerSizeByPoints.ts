import { CAMERA } from "../constants/camera";
import { PIN } from "../constants/pin";

const interpolateSize = (
  zoom: number,
  minZoom = CAMERA.MIN_ZOOM,
  maxZoom = CAMERA.MAX_ZOOM,
  minSize = PIN.MIN_SIZE,
  maxSize = PIN.MAX_SIZE,
  inTop = false
) => {
  zoom = Math.max(minZoom, Math.min(zoom, maxZoom));
  const adjustedMaxSize = inTop ? maxSize * 2 : maxSize;

  const size =
    minSize +
    ((adjustedMaxSize - minSize) * (zoom - minZoom)) / (maxZoom - minZoom);
  return size;
};

export const getMarkerSizeByPoints = (
  points: number,
  zoom: number,
  inTop: boolean
) => {
  let sizeAdjustment = 0;

  if (points < 5) {
    sizeAdjustment = 0;
  } else if (points >= 5 && points < 10) {
    sizeAdjustment = 5;
  } else if (points >= 10) {
    sizeAdjustment = 10;
  } else if (points >= 10) {
    sizeAdjustment = 15;
  }

  return interpolateSize(
    zoom,
    CAMERA.MIN_ZOOM,
    CAMERA.MAX_ZOOM,
    PIN.MIN_SIZE,
    PIN.MAX_SIZE,
    inTop
  );
};
