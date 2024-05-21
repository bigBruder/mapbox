import { createContext, useEffect, useState } from "react";
import { getPinsForBound } from "../../api/client";
import { Heatmap, VibesItem } from "../../types/searchResponse";
import { CameraBound } from "../../types/CameraBound";
import { queryParams } from "../../types/queryParams";
import initialValue from "./initialValue";
import { TransformToIsoDate } from "../../utils/TransformToIsoDate";

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

    if (selectedDate === "Custom") {
      if (customDate.startDate && customDate.endDate) {
        queryParams.Before = customDate.endDate.toISOString();
        queryParams.endsAfter = customDate.startDate.toISOString();
      }
    } else {
      queryParams.Before = TransformToIsoDate(selectedDate).before;
      if (
        selectedDate === "Next Month" ||
        selectedDate === "Now" ||
        selectedDate === "Today" ||
        selectedDate === "Next 7 Days" ||
        selectedDate === "Next 14 Days" ||
        selectedDate === "Next 30 Days"
      ) {
        queryParams.endsAfter = TransformToIsoDate(selectedDate).after;
      } else {
        queryParams.After = TransformToIsoDate(selectedDate).after;
      }
    }

    getPinsForBound(queryParams).then((pinsForBound) => {
      setTotalResultsAmount(pinsForBound.value.totalResults);
    });
  }, [selectedTag, selectedDate, customDate.startDate, customDate.endDate]);

  useEffect(() => {
    if (!cameraBound) return;
    console.log("effect");
    const { ne, sw } = cameraBound.properties.bounds;
    const queryParams: queryParams = {
      "NE.Latitude": sw[1],
      "NE.Longitude": sw[0],
      "SW.Latitude": ne[1],
      "SW.Longitude": ne[0],
      OrderBy: "Points",
      PageSize: cameraBound.properties.zoom > 15 ? 15 : 10,
      "TopTags.Enable": true,
      IncludeTotalCount: true,
      "Heatmap.Enable": true,
      "Heatmap.Resolution": cameraBound.properties.zoom > 10 ? 9 : 8,
    };
    if (selectedTag) {
      queryParams["Tags"] = selectedTag;
    }

    if (selectedDate === "Custom") {
      if (customDate.startDate && customDate.endDate) {
        queryParams.Before = customDate.endDate.toISOString();
        queryParams.endsAfter = customDate.startDate.toISOString();
      }
    } else {
      queryParams.Before = TransformToIsoDate(selectedDate).before;
      if (
        selectedDate === "Next Month" ||
        selectedDate === "Now" ||
        selectedDate === "Today" ||
        selectedDate === "Next 7 Days" ||
        selectedDate === "Next 14 Days" ||
        selectedDate === "Next 30 Days"
      ) {
        queryParams.endsAfter = TransformToIsoDate(selectedDate).after;
      } else {
        queryParams.After = TransformToIsoDate(selectedDate).after;
      }
    }

    getPinsForBound(queryParams).then((pinsForBound) => {
      if (!pinsForBound.value) return;
      const sortedPins = [...pinsForBound.value.vibes].sort((a, b) => {
        const aWeight = a.points + (a.isTop ? 1 : 0);
        const bWeight = b.points + (b.isTop ? 1 : 0);

        if (aWeight > bWeight) {
          return 1;
        } else if (aWeight < bWeight) {
          return -1;
        } else {
          return new Date(a.startsAt) > new Date(b.startsAt) ? 1 : -1;
        }
      });

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
