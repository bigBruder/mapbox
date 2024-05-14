export type queryParams = {
  "NE.Latitude": number;
  "NE.Longitude": number;
  "SW.Latitude": number;
  "SW.Longitude": number;
  After?: string;
  Before?: string;
  OrderBy: string;
  PageSize: number;
  IncludeTotalCount: boolean;
  "TopTags.Enable"?: boolean;
  "Heatmap.Enable"?: boolean;
  "Heatmap.Resolution"?: number;
  Tags?: string;
  endsAfter?: string;
};
