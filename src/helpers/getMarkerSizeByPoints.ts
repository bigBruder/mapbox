const MAX_SIZE = 30;
const MIN_SIZE = 10;

export const getMarkerSizeByPoints = (points: number, zoom: number) => {
  let sizeAdjustment;

  if (points < 6) {
    sizeAdjustment = 0;
  } else if (points >= 6 && points < 10) {
    sizeAdjustment = 5;
  } else if (points >= 10) {
    sizeAdjustment = 10;
  } else {
    sizeAdjustment = 0;
  }

  switch (true) {
    case zoom < 10:
      return MIN_SIZE + sizeAdjustment;
    case zoom >= 5 && zoom < 10:
      return MIN_SIZE + 5 + sizeAdjustment;
    case zoom >= 10 && zoom < 15:
      return MIN_SIZE + 10 + sizeAdjustment;
    case zoom >= 15 && zoom < 25:
      return MIN_SIZE + 15 + sizeAdjustment;
    case zoom >= 25:
      return MAX_SIZE;
    default:
      return MIN_SIZE + sizeAdjustment;
  }
};
