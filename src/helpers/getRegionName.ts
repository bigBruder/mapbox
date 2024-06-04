import { RegionInfoFeature } from "../types/responses/RegionInfoResponse";
import { getFeatureTypeByZoom } from "./getFeatureTypeByZoom";

export const getRegionName = (features: RegionInfoFeature[], zoom: number) => {
  console.log("features", features, zoom);
  const feature = features.find((feature: RegionInfoFeature) =>
    feature.place_type.some((type) => type === getFeatureTypeByZoom(zoom))
  );
  console.log(feature?.place_name.split(",")[0]);
  return feature?.place_name.split(",")[0];
};
