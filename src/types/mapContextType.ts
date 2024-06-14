import { Dispatch } from "react";
import { CameraBound } from "./CameraBound";
import { Heatmap, VibesItem } from "./SearchResponse";
import { DateType } from "react-native-ui-datepicker";

export type MapContextType = {
  totalResultsAmount: {
    total: number;
    visible: number;
  };
  setTotalResultsAmount: (totalResultsAmount: {
    total: number;
    visible: number;
  }) => void;
  setCameraBound: (cameraBound: CameraBound | null) => void;
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
  setCustomDate: Dispatch<
    React.SetStateAction<{ startDate: DateType; endDate: DateType }>
  >;
};
