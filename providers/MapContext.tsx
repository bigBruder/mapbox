import { createContext, useEffect, useState } from "react";
import { IPoints } from "../types/Points";
import { getPoints } from "../api/client";

const initialValue = {
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
  const [map, setMap] = useState(null);
  const [pointsOfInterest, setPointsOfInterest] = useState<IPoints[]>([]);

  const [loading, setLoading] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<IPoints | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Next Month");

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

  const value = {
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
