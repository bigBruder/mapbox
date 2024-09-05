type H3Index = string; // Each key is an H3 index (a string)
type HexagonData = number; // Each value is a number representing some data for that hexagon

export type HexagonMap = {
  [key in H3Index]: HexagonData;
};
