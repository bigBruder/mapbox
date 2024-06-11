export const getDistanceBetweenPoints = (
  pointA: number[],
  pointB: number[]
) => {
  if (!pointA || !pointB) return 0;
  return Math.hypot(pointA[0] - pointB[0], pointB[1] - pointB[1]);
};
