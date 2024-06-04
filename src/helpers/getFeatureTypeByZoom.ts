export const getFeatureTypeByZoom = (zoom: number) => {
  if (zoom < 5) {
    return "country";
  } else if (zoom < 12) {
    return "region";
  } else {
    return "place";
  }
};
