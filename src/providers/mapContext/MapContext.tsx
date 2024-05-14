import { createContext, useEffect, useState } from "react";
import { getPinsForBound } from "../../api/client";
import { Heatmap, VibesItem } from "../../types/searchResponse";
import { CameraBound } from "../../types/CameraBound";
import { queryParams } from "../../types/queryParams";
import { fetchLocation } from "../../utils/fetchLocation";
import initialValue from "./initialValue";
import { TransformToIsoDate } from "../../utils/TransformToIsoDate";

const MyContext = createContext(initialValue);

export const MapContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [myLocation, setMyLocation] = useState<{
    latitude: number;
    longitude: number;
    source: string;
  } | null>(null);

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

  useEffect(() => {
    fetchLocation().then((location) => {
      if (location) {
        setMyLocation(location);
      }
    });
  }, []);

  const [cameraBound, setCameraBound] = useState<CameraBound | null>(null);

  const [pinsForBound, setPinsForBound] = useState<VibesItem[]>([]);

  console.log(
    "pins ==> ",
    pinsForBound.map(
      (pin) => "\n" + pin.startsAt + "----" + pin.expiresAt + "\n"
    )
  );

  useEffect(() => {
    if (!cameraBound) return;
    const { ne, sw } = cameraBound.properties.bounds;
    const queryParams: queryParams = {
      "NE.Latitude": sw[1],
      "NE.Longitude": sw[0],
      "SW.Latitude": ne[1],
      "SW.Longitude": ne[0],
      // Before: TransformToIsoDate(selectedDate).before,
      // endsAfter: TransformToIsoDate(selectedDate).after,
      OrderBy: "Points",
      PageSize: cameraBound.properties.zoom > 15 ? 40 : 20,
      IncludeTotalCount: true,
      "TopTags.Enable": true,
      "Heatmap.Enable": true,
      "Heatmap.Resolution": 9,
    };
    if (selectedTag) {
      queryParams["Tags"] = selectedTag;
    }

    if (selectedDate === "Custom") {
      queryParams.Before = customDate.endDate.toISOString();
      queryParams.endsAfter = customDate.startDate.toISOString();
    } else {
      queryParams.Before = TransformToIsoDate(selectedDate).before;
      if (
        selectedDate === "Next Month" ||
        selectedDate === "Now" ||
        selectedDate === "Today" ||
        selectedDate === "Next 7 days" ||
        selectedDate === "Next 14 days" ||
        selectedDate === "Next 30 days"
      ) {
        queryParams.endsAfter = TransformToIsoDate(selectedDate).after;
      } else {
        console.log("selectedDate = ", selectedDate);
        queryParams.After = TransformToIsoDate(selectedDate).after;
      }
    }

    console.log(selectedDate);
    console.log("startDate = ", TransformToIsoDate(selectedDate).after);
    console.log("endDate = ", TransformToIsoDate(selectedDate).before);

    getPinsForBound(queryParams).then((pinsForBound) => {
      setPinsForBound(pinsForBound.value.vibes);
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

  const value = {
    customDate,
    setCustomDate,
    selectedDate,
    myLocation,
    setMyLocation,
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
