import { CAMERA } from "@/constants/camera";
import { PIN } from "@/constants/pin";

const interpolateSize = (
  zoom: number,
  minZoom = CAMERA.MIN_ZOOM,
  maxZoom = CAMERA.MAX_ZOOM,
  minSize = PIN.MIN_SIZE,
  maxSize = PIN.MAX_SIZE,
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
    sizeAdjustment = 10;
  } else if (points >= 10) {
    sizeAdjustment = 15;
  } else {
    sizeAdjustment = 0;
  }

  return interpolateSize(
    zoom,
    CAMERA.MIN_ZOOM,
    CAMERA.MAX_ZOOM,
    PIN.MIN_SIZE,
    PIN.MAX_SIZE,
    sizeAdjustment
  );
};
