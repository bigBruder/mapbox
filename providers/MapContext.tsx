import { createContext, useEffect, useState } from "react";
import { IPoints } from "../types/Points";
import { getPoints, searchHeats, searchPosts } from "../api/client";
import useLocation from "../hooks/useLocation";

const initialValue = {
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

  const [pins, setPins] = useState([]);

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
        const response = await searchPosts({
          latitude: myLocation[0],
          longitude: myLocation[1],
        });
        setPins(response.value.vibes.map((vibe) => vibe.venue.geo));
      })();
    } catch (error) {
      console.error("Error fetching pins by search:", error);
    }
  }, [myLocation]);

  const value = {
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
