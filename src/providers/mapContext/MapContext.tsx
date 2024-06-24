import { createContext, useEffect, useMemo, useState } from "react";
import initialValue from "./initialValue";
import { getPinsForBound } from "@/api/client";
import { updateHeatmap } from "@/services/updateHeatmap";
import { updatePinsForBound } from "@/services/updatePinsForBound";
import { Heatmap, VibesItem } from "@/types/SearchResponse";
import { CameraBound } from "@/types/CameraBound";
import { QueryParams } from "@/types/QueryParams";
import { getDateParams } from "@/helpers/getDateParams";

const MyContext = createContext(initialValue);

export const MapContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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

  const dateParams = useMemo(
    () => getDateParams(selectedDate, customDate),
    [selectedDate, customDate]
  );

  useEffect(() => {
    updatePinsForBound(
      cameraBound,
      selectedTag,
      dateParams,
      setPinsForBound,
      setTags,
      setTotalResultsAmount,
      [],
      true
    );
  }, [selectedTag, selectedDate, customDate.startDate, customDate.endDate]);

  useEffect(() => {
    updatePinsForBound(
      cameraBound,
      selectedTag,
      dateParams,
      setPinsForBound,
      setTags,
      setTotalResultsAmount,
      pinsForBound
    );
  }, [
    cameraBound?.properties.bounds.ne[0],
    selectedTag,
    selectedDate,
    customDate.startDate,
    customDate.endDate,
  ]);

  useEffect(() => {
    updateHeatmap(cameraBound, selectedTag, dateParams, setHeatMap);
  }, [
    cameraBound?.properties.zoom,
    selectedTag,
    selectedDate,
    customDate.startDate,
    customDate.endDate,
  ]);

  useEffect(() => {
    if (pinsForBound.length > 300) {
      setPinsForBound((prev) => prev.slice(50));
    }
  }, [pinsForBound.length]);

  useEffect(() => {
    const queryParams: Partial<QueryParams> = {
      PageSize: 1,
      IncludeTotalCount: true,
      Tags: selectedTag || undefined,
      ...dateParams,
    };

    getPinsForBound(queryParams).then((response) => {
      if (response?.value) {
        setTotalResultsAmount((prev) => ({
          ...prev,
          total: response.value.totalResults,
        }));
      }
    });
  }, [selectedTag, selectedDate, customDate.startDate, customDate.endDate]);

  const value = {
    totalResultsAmount,
    setTotalResultsAmount,
    customDate,
    setCustomDate,
    selectedDate,
    setSelectedDate,
    selectedTag,
    setSelectedTag,
    pinsForBound,
    setPinsForBound,
    cameraBound,
    setCameraBound,
    heatMap,
    setHeatMap,
    tags,
    setTags,
    selectedMarker,
    setSelectedMarker,
    showModal,
    setShowModal,
  };

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};

export default MyContext;
