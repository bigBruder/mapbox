export const getMarkerSizeByPoints = (points: number) => {
  switch (true) {
    case points > 8:
      return 35;
    case points > 5 && points < 8:
      return 25;
    default:
      return 20;
  }
};
