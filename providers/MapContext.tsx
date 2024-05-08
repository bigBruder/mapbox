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
        const response: Response = await searchPosts({
          latitude: myLocation[0],
          longitude: myLocation[1],
          "TopTags.Enable": "true",
        });
        setTags(response.value["tags"]);
        // console.log("response.value.tags", response.value.tags);
        setPins(response.value.vibes);
      })();
    } catch (error) {
      console.error("Error fetching pins by search:", error);
    }
  }, [myLocation]);

  const value = {
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
