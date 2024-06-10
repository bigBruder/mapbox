import { SetStateAction } from "react";
import { CameraBound } from "../../types/CameraBound";
import { MapContextType } from "../../types/mapContextType";
import { VibesItem } from "../../types/searchResponse";
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
  setCustomDate: (date: { startDate: DateType; endDate: DateType }) => {},
  cameraBound: null,
  loading: false,
  setLoading: (loading: boolean) => {},
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
