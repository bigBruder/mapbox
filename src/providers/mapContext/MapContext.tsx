import { createContext, useEffect, useState } from "react";
import { getPinsForBound } from "../../api/client";
import { Heatmap, VibesItem } from "../../types/searchResponse";
import { CameraBound } from "../../types/CameraBound";
import { queryParams } from "../../types/queryParams";
import { fetchLocation } from "../../utils/fetchLocation";
import initialValue from "./initialValue";

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
  const [selectedDate, setSelectedDate] = useState("Next Month");

  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [heatMap, setHeatMap] = useState<Heatmap>({
    data: {},
    resolution: 9,
    cellRadius: 100,
  });

  useEffect(() => {
    (async () => {
      const location = await fetchLocation();
      if (location) {
        setMyLocation(location);
      }
    })();
  }, []);

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
      After: "2024-04-17Z",
      Before: "2024-04-30Z",
      OrderBy: "Points",
      PageSize: cameraBound.properties.zoom > 12 ? 50 : 20,
      IncludeTotalCount: true,
      "TopTags.Enable": true,
      "Heatmap.Enable": true,
      "Heatmap.Resolution": 9,
    };
    if (selectedTag) {
      queryParams["Tags"] = selectedTag;
    }

    (async () => {
      try {
        const pinsForBound = await getPinsForBound(queryParams);
        setPinsForBound(pinsForBound.value.vibes);
        setTags(Object.keys(pinsForBound.value.tags));
        setHeatMap(pinsForBound.value.heatmap);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [cameraBound?.properties.bounds.ne, selectedTag]);

  const value = {
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
    selectedDate,
    setSelectedDate,
  };
  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};

export default MyContext;
