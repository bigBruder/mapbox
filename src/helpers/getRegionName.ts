import { RegionInfoFeature } from "@/types/responses/RegionInfoResponse";
import { getFeatureTypeByZoom } from "./getFeatureTypeByZoom";

export const getRegionName = (features: RegionInfoFeature[], zoom: number) => {
  const feature = features.find((feature: RegionInfoFeature) =>
    feature.place_type.some((type) => type === getFeatureTypeByZoom(zoom))
  );
  return feature?.place_name.split(",")[0];
};
