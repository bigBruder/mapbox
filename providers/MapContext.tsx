import { createContext, useEffect, useState } from "react";
import { IPoints } from "../types/Points";
import { getPoints, searchHeats, searchPosts } from "../api/client";
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
};

const MyContext = createContext(initialValue);

export const MapContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const myLocation = useLocation();
  const [map, setMap] = useState(null);
  const [pointsOfInterest, setPointsOfInterest] = useState<IPoints[]>([]);

  const [loading, setLoading] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<IPoints | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Next Month");

  const [tags, setTags] = useState<string[]>([]);
  const [heatMap, setHeatMap] = useState([]);

  const [pins, setPins] = useState<VibesItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const points: IPoints[] = await getPoints();
        setPointsOfInterest(points);
      } catch (error) {
        console.error("Error fetching points:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (myLocation === null) return;
    try {
      (async () => {
        // const response: Response = await searchPosts({
        //   latitude: myLocation[0],
        //   longitude: myLocation[1],
        //   // "TopTags.Enable": "true",
        //   // radius: 1000,
        //   // "heatmap.enable": "true",
        //   // orderBy: "Points",
        //   before: "2024-04-30Z",
        //   after: "2024-04-17Z",
        // });
        const response = await searchPosts({
          // before: "2024-04-30Z",
          // after: "2024-04-17Z",
          "location.latitude": myLocation[1] || 40.0471767,
          "location.longitude": myLocation[0] || -75.0303379,
          radius: 3000,
          "heatmap.enable": true,
          "topTags.enable": true,
          pageSize: 20,
          orderBy: "Points",
        });
        setHeatMap(response.value.heatmap);
        setTags(Object.keys(response.value.tags));

        setPins(response.value.vibes);
      })();
    } catch (error) {
      console.error("Error fetching pins by search:", error);
    }
  }, [myLocation]);

  console.log("HEATMAP ++++++>", heatMap);

  const value = {
    heatMap,
    tags,
    pins,
    pointsOfInterest: pointsOfInterest,
    setPointsOfInterest,
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
