import { createContext, useEffect, useState } from "react";
import { getPinsForBound } from "../../api/client";
import { Heatmap, VibesItem } from "../../types/searchResponse";
import { CameraBound } from "../../types/CameraBound";
import { queryParams } from "../../types/queryParams";
import { fetchLocation } from "../../utils/fetchLocation";
import initialValue from "./initialValue";
import { TransformToIsoDate } from "../../utils/TransformToIsoDate";
import useRealTimeLocation from "../../hooks/useRealTimeLocation";

const MyContext = createContext(initialValue);

export const MapContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // const [myLocation, setMyLocation] = useState<{
  //   latitude: number;
  //   longitude: number;
  //   source: string;
  // } | null>(null);

  const { location, error } = useRealTimeLocation();

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

  // useEffect(() => {
  //   fetchLocation().then((location) => {
  //     if (location) {
  //       setMyLocation(location);
  //     }
  //   });
  // }, []);

  const [cameraBound, setCameraBound] = useState<CameraBound | null>(null);

  const [pinsForBound, setPinsForBound] = useState<VibesItem[]>([]);

  useEffect(() => {
    if (!cameraBound) return;
    const { ne, sw } = cameraBound.properties.bounds;
    const queryParams: queryParams = {
      "NE.Latitude": sw[1],
      "NE.Longitude": sw[0],
      "SW.Latitude": ne[1],
      "SW.Longitude": ne[0],
      OrderBy: "Points",
      PageSize: cameraBound.properties.zoom > 15 ? 10 : 5,
      IncludeTotalCount: true,
      "TopTags.Enable": true,
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

    // console.log("queryParams", queryParams);

    getPinsForBound(queryParams).then((pinsForBound) => {
      const sortedPins = [...pinsForBound.value.vibes].sort(
        (a, b) => (a.points + a.isTop ? 5 : 0) - (b.points + b.isTop ? 5 : 0)
      );
      setPinsForBound(sortedPins);

      setTags(Object.keys(pinsForBound.value.tags));
      setHeatMap(pinsForBound.value.heatmap);
    });
  }, [
    cameraBound?.properties.bounds.ne,
    selectedTag,
    selectedDate,
    customDate.startDate,
    customDate.endDate,
  ]);

  // console.log(
  //   "\n" +
  //     pinsForBound.map(
  //       (pin) =>
  //         "event StartAt: " +
  //         pin.startsAt +
  //         " ----- " +
  //         "event ExpiredAt" +
  //         pin.expiresAt +
  //         "\n\n"
  //     )
  // );

  const value = {
    customDate,
    setCustomDate,
    selectedDate,
    location,
    // setMyLocation,
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
