import { createContext, useEffect, useMemo, useState } from "react";
import { getHeatmap, getPinsForBound } from "../../api/client";
import { Heatmap, VibesItem } from "../../types/searchResponse";
import { CameraBound } from "../../types/CameraBound";
import { queryParams } from "../../types/queryParams";
import initialValue from "./initialValue";
import { getHeatmapResolutionByZoom } from "../../helpers/getHeatmapResolutionByZoom";
import { getDateParams } from "../../helpers/getDateParams";
import { sortPinsByWeightAndDate } from "../../utils/sortPinsByWeightAndDate";

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
  const [totalResultsAmount, setTotalResultsAmount] = useState({
    total: 0,
    visible: 0,
  });
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
      if (!pinsForBound.value) return;
      setTotalResultsAmount((prev) => {
        return {
          ...prev,
          total: pinsForBound.value.totalResults,
        };
      });
    });
  }, [selectedTag, selectedDate, customDate.startDate, customDate.endDate]);
  const tag = selectedTag ? selectedTag : "";
  const dateParams = useMemo(
    () => getDateParams(selectedDate, customDate),
    [selectedDate, customDate.startDate, customDate.endDate]
  );

  useEffect(() => {
    setPinsForBound([]);
  }, [selectedTag, selectedDate, customDate.startDate, customDate.endDate]);

  useEffect(() => {
    if (!cameraBound) return;
    const { ne, sw } = cameraBound.properties.bounds;

    getHeatmap({
      "NE.Latitude": ne[1],
      "NE.Longitude": ne[0],
      "SW.Latitude": sw[1],
      "SW.Longitude": sw[0],
      "Heatmap.Resolution": getHeatmapResolutionByZoom(
        cameraBound.properties.zoom
      ),
      SingleItemPerVenue: true,
      Tags: tag || undefined,

      ...dateParams,
    }).then((heatmap) => {
      if (!heatmap.value) return;
      setHeatMap(heatmap.value.heatmap);
    });
  }, [
    selectedTag,
    selectedDate,
    customDate.startDate,
    customDate.endDate,
    cameraBound?.properties.bounds.ne[0],
  ]);

  useEffect(() => {
    if (!cameraBound) return;
    const { ne, sw } = cameraBound.properties.bounds;
    const queryParams: queryParams = {
      "NE.Latitude": ne[1],
      "NE.Longitude": ne[0],
      "SW.Latitude": sw[1],
      "SW.Longitude": sw[0],
      OrderBy: "Points",
      PageSize: 25,
      "TopTags.Enable": true,
      IncludeTotalCount: true,
      SingleItemPerVenue: true,
    };
    if (selectedTag) {
      queryParams["Tags"] = selectedTag;
    }
    getPinsForBound({ ...queryParams, ...dateParams }).then((response) => {
      if (!response?.value) return;
      const prevIds = pinsForBound.map((pin) => pin.id);
      const filteredPins = response.value.vibes
        .filter((vibe) => !prevIds.includes(vibe.id))
        .reverse();

      setPinsForBound((prev) =>
        sortPinsByWeightAndDate([...prev, ...filteredPins])
      );
      setTags(Object.keys(response.value.tags));
    });
  }, [
    cameraBound?.properties.bounds.ne[0],
    selectedTag,
    selectedDate,
    customDate.startDate,
    customDate.endDate,
  ]);

  useEffect(() => {
    if (pinsForBound.length > 200) {
      setPinsForBound((prev) => prev.slice(50, prev.length));
    }
  }, [pinsForBound.length]);

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
