import { createContext, useEffect, useState } from "react";
import { getHeatmap, getPinsForBound } from "../../api/client";
import { Heatmap, VibesItem } from "../../types/searchResponse";
import { CameraBound } from "../../types/CameraBound";
import { queryParams } from "../../types/queryParams";
import initialValue from "./initialValue";
import { TransformToIsoDate } from "../../utils/TransformToIsoDate";
import { getHeatmapResolutionByZoom } from "../../helpers/getHeatmapResolutionByZoom";
import useRealTimeLocation from "../../hooks/useRealTimeLocation";
import { getDateParams } from "../../helpers/getDateParams";
import { sortPinsByWeightAndDate } from "../../helpers/sortPins";

const MyContext = createContext(initialValue);

export const MapContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<VibesItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Now");
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [cameraBound, setCameraBound] = useState<CameraBound | null>(null);
  const [pinsForBound, setPinsForBound] = useState<VibesItem[]>([]);
  const [totalResultsAmount, setTotalResultsAmount] = useState(0);
  const [heatMap, setHeatMap] = useState<Heatmap>({
    data: {},
    resolution: 9,
    cellRadius: 100,
  });
  const [customDate, setCustomDate] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  useEffect(() => {
    const queryParams: Partial<queryParams> = {
      PageSize: 1,
      IncludeTotalCount: true,
    };
    if (selectedTag) {
      queryParams["Tags"] = selectedTag;
    }

    const dateParams = getDateParams(selectedDate, customDate);

    getPinsForBound({ ...queryParams, ...dateParams }).then((pinsForBound) => {
      setTotalResultsAmount(pinsForBound.value.totalResults);
    });
  }, [selectedTag, selectedDate, customDate.startDate, customDate.endDate]);

  useEffect(() => {
    if (!cameraBound) return;
    const { ne, sw } = cameraBound.properties.bounds;
    const queryParams: queryParams = {
      "NE.Latitude": sw[1],
      "NE.Longitude": sw[0],
      "SW.Latitude": ne[1],
      "SW.Longitude": ne[0],
      OrderBy: "Points",
      PageSize: cameraBound.properties.zoom > 15 ? 25 : 10,
      "TopTags.Enable": true,
      IncludeTotalCount: true,
      "Heatmap.Enable": true,
      "Heatmap.Resolution": getHeatmapResolutionByZoom(
        cameraBound.properties.zoom
      ),
    };
    if (selectedTag) {
      queryParams["Tags"] = selectedTag;
    }

    const dateParams = getDateParams(selectedDate, customDate);

    // console.log("res", getHeatmapResolutionByZoom(cameraBound.properties.zoom));

    // console.log({ ...dateParams });

    getPinsForBound({ ...queryParams, ...dateParams }).then((pinsForBound) => {
      if (!pinsForBound.value) return;
      const sortedPins = sortPinsByWeightAndDate(pinsForBound.value.vibes);

      setPinsForBound(sortedPins);
      setTags(Object.keys(pinsForBound.value.tags));
      // setHeatMap(pinsForBound.value.heatmap);
    });
    getHeatmap({
      "NE.Latitude": ne[1],
      "NE.Longitude": ne[0],
      "SW.Latitude": sw[1],
      "SW.Longitude": sw[0],
      "Heatmap.Resolution": getHeatmapResolutionByZoom(
        cameraBound.properties.zoom
      ),
      ...dateParams,
    }).then((heatmap) => {
      // console.log(heatmap.value, "heatmap");
      setHeatMap(heatmap.value.heatmap);
    });
  }, [
    cameraBound?.properties.bounds.ne[0],
    selectedTag,
    selectedDate,
    customDate.startDate,
    customDate.endDate,
  ]);

  // console.log(heatMap.cellRadius, "heatMap");

  const value = {
    totalResultsAmount,
    setTotalResultsAmount,
    customDate,
    setCustomDate,
    selectedDate,
    selectedTag,
    setSelectedTag,
    pinsForBound,
    cameraBound,
    setCameraBound,
    heatMap,
    tags,
    setTags,
    loading,
    setLoading,
    selectedMarker,
    setSelectedMarker,
    showModal,
    setShowModal,
    setSelectedDate,
  };
  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};

export default MyContext;
