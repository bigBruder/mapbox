import { createContext, useEffect, useState } from "react";
import { getPinsForBound } from "../../api/client";
import { Heatmap, VibesItem } from "../../types/searchResponse";
import { CameraBound } from "../../types/CameraBound";
import { queryParams } from "../../types/queryParams";
import initialValue from "./initialValue";
import { TransformToIsoDate } from "../../utils/TransformToIsoDate";
import { sortPinsByWeightAndDate } from "../../utils/sortPins";
import { queryParamsBuilder } from "../../helpers/queryParamsBuilder";

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
  const [customDate, setCustomDate] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [heatMap, setHeatMap] = useState<Heatmap>({
    data: {},
    resolution: 9,
    cellRadius: 100,
  });

  const [cameraBound, setCameraBound] = useState<CameraBound | null>(null);

  const [pinsForBound, setPinsForBound] = useState<VibesItem[]>([]);

  useEffect(() => {
    if (!cameraBound) return;
    const queryParams: queryParams = queryParamsBuilder(
      cameraBound,
      selectedTag,
      selectedDate,
      customDate
    );

    getPinsForBound(queryParams).then((pinsForBound) => {
      if (!pinsForBound.value) return;
      const sortedPins = sortPinsByWeightAndDate(pinsForBound.value.vibes);
      setPinsForBound(sortedPins);

      setTags(Object.keys(pinsForBound.value.tags));
      setHeatMap(pinsForBound.value.heatmap);
    });
  }, [
    cameraBound?.properties.bounds.ne[0],
    selectedTag,
    selectedDate,
    customDate.startDate,
    customDate.endDate,
  ]);

  const value = {
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
