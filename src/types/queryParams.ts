export type QueryParams = {
  "NE.Latitude": number;
  "NE.Longitude": number;
  "SW.Latitude": number;
  "SW.Longitude": number;
  "TopTags.Enable"?: boolean;
  "Heatmap.Enable"?: boolean;
  "Heatmap.Resolution"?: number;
  After?: string;
  Before?: string;
  OrderBy: string;
  PageSize: number;
  IncludeTotalCount?: boolean;
  Tags?: string;
  endsAfter?: string;
  SingleItemPerVenue?: boolean;
};
