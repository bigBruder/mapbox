interface Geometry {
  type: string;
  coordinates: number[] | number[][] | number[][][];
}

interface Properties {
  [key: string]: any;
}

interface Context {
  id: string;
  short_code?: string;
  wikidata?: string;
  text: string;
}

interface Feature {
  bbox: number[];
  center: number[];
  context: Context[];
  geometry: Geometry;
  id: string;
  place_name: string;
  place_type: string[];
  properties: Properties;
  relevance: number;
  text: string;
  type: string;
}

interface RegionInfoResponse {
  attribution: string;
  features: Feature[];
  query: number[];
  type: string;
}
