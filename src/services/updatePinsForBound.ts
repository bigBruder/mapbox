import { getPinsForBound } from "@/api/client";
import { getHeatmapResolutionByZoom } from "@/helpers/getHeatmapResolutionByZoom";
import { getGridIndex } from "@/helpers/helpers";
import { CameraBound } from "@/types/CameraBound";
import { QueryParams } from "@/types/QueryParams";
import { VibesItem } from "@/types/SearchResponse";
import { sortPinsByWeightAndDate } from "@/utils/sortPinsByWeightAndDate";

export const updatePinsForBound = (
  cameraBound: CameraBound | null,
  selectedTag: string | null,
  dateParams: Partial<QueryParams>,
  setPinsForBound: React.Dispatch<React.SetStateAction<VibesItem[]>>,
  setTags: React.Dispatch<React.SetStateAction<string[]>>,
  setTotalResultsAmount: React.Dispatch<
    React.SetStateAction<{ total: number; visible: number }>
  >,
  pinsForBound: VibesItem[],
  isClearUpdate: boolean = false
) => {
  if (!cameraBound) return;
  const { ne, sw } = cameraBound.properties.bounds;
  const zoom = cameraBound.properties.zoom;
  const center = cameraBound.properties.center;
  const isMeridianCrossed = center[0] < sw[0] || center[0] > ne[0];
  const queryParams: QueryParams = {
    "NE.Latitude": ne[1],
    "NE.Longitude": !isMeridianCrossed ? ne[0] : sw[0],
    "SW.Latitude": sw[1],
    "SW.Longitude": !isMeridianCrossed ? sw[0] : ne[0],
    OrderBy: "Points",
    PageSize: 40,
    "TopTags.Enable": true,
    IncludeTotalCount: true,
    SingleItemPerVenue: true,
    Tags: selectedTag || undefined,
    "Filter.OnePerCell": true,
    "Filter.Resolution": Math.round(getGridIndex(zoom)),
    // "GridIndex.Enable": true,
    // "GridIndex.Resolution": Math.round(getGridIndex(zoom)),
    ...dateParams,
  };

  getPinsForBound(queryParams).then((response) => {
    if (!response?.value) return;
    if (isClearUpdate) {
      setPinsForBound(response.value.vibes);
    } else {
      //     const prevIds = pinsForBound.map((pin) => pin.id);
      //     const filteredPins = response.value.vibes
      //       .filter((vibe: VibesItem) => !prevIds.includes(vibe.id))
      //       .reverse();
      //     setTags(Object.keys(response.value.tags));
      //     setTotalResultsAmount((prev) => ({
      //       ...prev,
      //       visible: response.value.totalResults,
      //     }));
      //     if (filteredPins.length > 0) {
      //       setPinsForBound((prev) =>
      //         sortPinsByWeightAndDate([...prev, ...filteredPins])
      //       );
      //     }
      //   }
      // });
      setTags(Object.keys(response.value.tags));
      const revertedArray = response.value.vibes.reverse();
      setPinsForBound(revertedArray);
    }
  });
};
