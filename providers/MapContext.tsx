import { createContext, useEffect, useState } from "react";
import { getPinsForBound } from "../api/client";
import useLocation from "../hooks/useLocation";
import { VibesItem } from "../types/searchResponse";
import { CameraBound } from "../types/CameraBound";

type initialValueType = {
  // pins: VibesItem[];
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

  // {
  //   if (cameraBound) {
  //     console.log(
  //       Object.keys(cameraBound.properties.bounds.ne),
  //       cameraBound.properties.bounds.ne
  //     );
  //   }
  // }

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       setLoading(true);
  //       const points: IPoints[] = await getPoints();
  //       // setPointsOfInterest(points);
  //     } catch (error) {
  //       console.error("Error fetching points:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   })();
  // }, []);

  // useEffect(() => {
  //   if (myLocation === null) return;
  //   try {
  //     (async () => {
  //       const response = await searchPosts({
  //         // before: "2024-04-30Z",
  //         // after: "2024-04-17Z",
  //         "location.latitude": myLocation[1] || 40.0471767,
  //         "location.longitude": myLocation[0] || -75.0303379,
  //         radius: 3000,
  //         "heatmap.enable": true,
  //         "topTags.enable": true,
  //         pageSize: 20,
  //         orderBy: "Points",
  //       });
  //       setHeatMap(response.value.heatmap);
  //       setTags(Object.keys(response.value.tags));

  //       setPins(response.value.vibes);
  //     })();
  //   } catch (error) {
  //     console.error("Error fetching pins by search:", error);
  //   }
  // }, [myLocation, cameraCenter]);

  useEffect(() => {
    if (!cameraBound) return;
    const { ne, sw } = cameraBound.properties.bounds;
    (async () => {
      const queryParams = {
        "NE.Latitude": ne[1],
        "NE.Longitude": ne[0],
        "SW.Latitude": sw[1],
        "SW.Longitude": sw[0],
        After: "2024-04-17Z",
        Before: "2024-04-30Z",
        OrderBy: "Points",
        PageSize: 20,
        IncludeTotalCount: true,
        "TopTags.Enable": true,
        "Heatmap.Enable": true,
        Heatmap_Resolution: 7,
      };
      const pinsForBound = await getPinsForBound(queryParams);
      console.log(pinsForBound, "pinsForBound");
      setPinsForBound(pinsForBound.value.vibes);
      setTags(Object.keys(pinsForBound.value.tags));
      setHeatMap(pinsForBound.value.heatmap);
    })();
  }, [cameraBound?.properties.bounds.ne, cameraBound?.properties.bounds.sw]);

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
