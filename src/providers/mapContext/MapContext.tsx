import { createContext, useMemo, useState } from "react";
import initialValue from "./initialValue";
import { VibesItem } from "@/types/SearchResponse";
import { CameraBound } from "@/types/CameraBound";

const MyContext = createContext(initialValue);

export const MapContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedMarker, setSelectedMarker] = useState<VibesItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Now");
  const [cameraBound, setCameraBound] = useState<CameraBound | null>(null);

  const value = {
    selectedDate,
    setSelectedDate,
    cameraBound,
    setCameraBound,
    selectedMarker,
    setSelectedMarker,
    showModal,
    setShowModal,
  };

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};

export default MyContext;
