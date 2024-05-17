import { Dispatch } from "react";
import { CameraBound } from "./CameraBound";
import { Heatmap, VibesItem } from "./searchResponse";
import { DateType } from "react-native-ui-datepicker";

export type MapContextType = {
  location: { latitude: number; longitude: number; source: string } | null;

  setCameraBound: (cameraBound: CameraBound | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  selectedMarker: VibesItem | null;
  setSelectedMarker: (marker: VibesItem | null) => void;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  pinsForBound: VibesItem[];
  selectedTag: string | null;
  setSelectedTag: Dispatch<React.SetStateAction<string | null>>;
  tags: string[];
  setTags: (tags: string[]) => void;
  heatMap: Heatmap;
  cameraBound: CameraBound | null;
  customDate: {
    startDate: Date;
    endDate: Date;
  };
  setCustomDate: (date: { startDate: DateType; endDate: DateType }) => void;
};
