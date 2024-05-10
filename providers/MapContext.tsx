import { createContext, useEffect, useState } from "react";
import { getPinsForBound } from "../api/client";
import useLocation from "../hooks/useLocation";
import { VibesItem } from "../types/searchResponse";
import { CameraBound } from "../types/CameraBound";
import { transformDataToHeatmap } from "../utils/transformDataToHeatData";

type initialValueType = {
  setCameraBound: (cameraBound: CameraBound | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  selectedMarker: VibesItem | null;
  setSelectedMarker: (marker: VibesItem | null) => void;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  pinsForBound: VibesItem[];
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
};

const initialValue: initialValueType = {
  // pins: [],
  loading: false,
  setLoading: (loading: boolean) => {},
  selectedMarker: null,
  setSelectedMarker: (marker: VibesItem | null) => {},
  showModal: false,
  setShowModal: (showModal: boolean) => {},
  selectedDate: "Next Month",
  setSelectedDate: (date: string) => {},
  pinsForBound: [],
  selectedTags: [],
  setSelectedTags: (tags: string[]) => {},
  tags: [],
  setTags: (tags: string[]) => {},
  setCameraBound: (cameraBound: CameraBound | null) => {},
};

const MyContext = createContext(initialValue);

export const MapContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const myLocation = useLocation();

  const [loading, setLoading] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<VibesItem | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Next Month");

  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [heatMap, setHeatMap] = useState([]);

  // const [pins, setPins] = useState<VibesItem[]>([]);
  const [cameraBound, setCameraBound] = useState<CameraBound | null>(null);

  const [pinsForBound, setPinsForBound] = useState<VibesItem[]>([]);

  useEffect(() => {
    if (!cameraBound) return;
    const { ne, sw } = cameraBound.properties.bounds;
    (async () => {
      try {
        const queryParams = {
          "NE.Latitude": sw[1],
          "NE.Longitude": sw[0],
          "SW.Latitude": ne[1],
          "SW.Longitude": ne[0],
          After: "2024-04-17Z",
          Before: "2024-04-30Z",
          OrderBy: "Points",
          PageSize: 20,
          IncludeTotalCount: true,
          "TopTags.Enable": true,
          "Heatmap.Enable": true,
          "Heatmap.Resolution": 9,
        };

        const pinsForBound = await getPinsForBound(queryParams);
        console.log("resolution to check ====> ", pinsForBound);
        setPinsForBound(pinsForBound.value.vibes);
        setTags(Object.keys(pinsForBound.value.tags));
        setHeatMap(pinsForBound.value.heatmap);
        // console.log(
        //   "\n---------------------------heatmap---------------------------\n",
        //   pinsForBound.value.heatmap,
        //   "\n",
        //   "---------------------------heatmap---------------------------\n"
        // );
      } catch (e) {
        console.error(e);
      }
    })();
  }, [cameraBound?.properties.bounds.ne]);

  const value = {
    selectedTags,
    setSelectedTags,
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
