export const getMarkerSizeByPoints = (points: number) => {
  switch (true) {
    case points > 10:
      return 30;
    case points > 7 && points < 10:
      return 25;
    default:
      return 20;
  }
};
