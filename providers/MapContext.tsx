import { createContext, useEffect, useState } from "react";
import { IPoints } from "../types/Points";
import {
  getPinsForBound,
  getPoints,
  searchHeats,
  searchPosts,
} from "../api/client";
import useLocation from "../hooks/useLocation";
import { Response, VibesItem } from "../types/searchResponse";

type initialValueType = {
  pins: VibesItem[];
  pointsOfInterest: IPoints[];
  setPointsOfInterest: (points: IPoints[] | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  selectedMarker: VibesItem | null;
  setSelectedMarker: (marker: IPoints | null) => void;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  pinsForBound: VibesItem[];
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
};

const initialValue: initialValueType = {
  pins: [],
  pointsOfInterest: [],
  setPointsOfInterest: (points: IPoints[] | null) => {},
  loading: false,
  setLoading: (loading: boolean) => {},
  selectedMarker: null,
  setSelectedMarker: (marker: IPoints | null) => {},
  showModal: false,
  setShowModal: (showModal: boolean) => {},
  selectedDate: "Next Month",
  setSelectedDate: (date: string) => {},
  pinsForBound: [],
  selectedTags: [],
  setSelectedTags: (tags: string[]) => {},
};

const MyContext = createContext(initialValue);

export const MapContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const myLocation = useLocation();
  // const [pointsOfInterest, setPointsOfInterest] = useState<IPoints[]>([]);

  const [loading, setLoading] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<IPoints | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Next Month");

  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [heatMap, setHeatMap] = useState([]);

  const [pins, setPins] = useState<VibesItem[]>([]);
  const [cameraBound, setCameraBound] = useState(null);

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
    console.log("-----____cameraBound____-----");
    if (!cameraBound) return;
    const { ne, sw } = cameraBound.properties.bounds;
    // console.log(ne, sw, "ne, sw");
    console.log(ne[0], ne[1], sw[0], sw[1], "ne, sw");
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
        Heatmap_Enable: true,
        Heatmap_Resolution: 7,
      };
      const pinsForBound = await getPinsForBound(queryParams);
      console.log(pinsForBound, "pinsForBound");
      setPinsForBound(pinsForBound.value.vibes);
      setTags(Object.keys(pinsForBound.value.tags));
    })();
  }, [cameraBound?.properties.bounds.ne, cameraBound?.properties.bounds.sw]);

  // console.log(pinsForBound[0]?.venue.name, "pinsForBound");

  const value = {
    selectedTags,
    setSelectedTags,
    pinsForBound,
    cameraBound,
    setCameraBound,
    heatMap,
    tags,
    pins,
    // pointsOfInterest: pointsOfInterest,
    // setPointsOfInterest,
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
