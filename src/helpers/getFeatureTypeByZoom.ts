export const getFeatureTypeByZoom = (zoom: number) => {
  if (zoom < 8) {
    return "country";
  } else if (zoom < 12) {
    return "region";
  } else {
    return "place";
  }
};
