import { CameraBound, MapContextType, VibesItem } from "@/types";
import { SetStateAction } from "react";
import { DateType } from "react-native-ui-datepicker";

const initialValue: MapContextType = {
  totalResultsAmount: {
    total: 0,
    visible: 0,
  },
  setTotalResultsAmount: (totalResultsAmount: {
    total: number;
    visible: number;
  }) => {},
  customDate: {
    startDate: new Date(),
    endDate: new Date(),
  },
  setCustomDate: function (
    value: SetStateAction<{ startDate: DateType; endDate: DateType }>
  ): void {},
  cameraBound: null,
  selectedMarker: null,
  setSelectedMarker: (marker: VibesItem | null) => {},
  showModal: false,
  setShowModal: (showModal: boolean) => {},
  selectedDate: "Next Month",
  setSelectedDate: (date: string) => {},
  pinsForBound: [],
  selectedTag: null,
  tags: [],
  setTags: (tags: string[]) => {},
  setCameraBound: (cameraBound: CameraBound | null) => {},
  setSelectedTag: function (value: SetStateAction<string | null>): void {
    throw new Error("Function not implemented.");
  },
  heatMap: {
    data: {},
    resolution: 0,
    cellRadius: 0,
  },
};

export default initialValue;
