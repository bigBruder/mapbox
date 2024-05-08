export interface Author {
  id: string;
}

export interface Geo {
  latitude: number;
  longitude: number;
}

export interface Venue {
  id: string;
  name: string;
  geo: Geo;
}

export interface VibesItem {
  expiresAt: string;
  author: Author;
  anonymous: boolean;
  state: string;
  isRecurring: boolean;
  id: string;
  venueId: string;
  venue: Venue;
  icon: string;
  points: number;
  publishedAt: string;
  startsAt: string;
}

export interface Tags {
  [key: string]: number;
}

export interface HeatmapData {
  [key: string]: number;
}

export interface Heatmap {
  data: HeatmapData;
  resolution: number;
  cellRadius: number;
}

export interface Value {
  vibes: VibesItem[];
  totalResults: number;
  tags: Tags;
  heatmap: Heatmap;
}

export interface Response {
  value: Value;
  success: boolean;
  messages: any[]; // You might want to define this further if you know the structure
}
