type Coordinates = number[][][];

interface Geometry {
  type: string;
  coordinates: Coordinates;
}

interface Properties {
  [key: string]: any;
}

interface Feature {
  type: "Feature";
  geometry: Geometry;
  properties: Properties;
}
