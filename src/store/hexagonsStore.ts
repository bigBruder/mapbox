import { create } from "zustand";

interface HexagonsState {
  h3Index: number;
  isAutoH3Index: boolean;
  polygons: Feature[];
  requiredIndexOnZoom: number;
  lastZoom: number;
  selectedPolygon: Feature | null;
  selectedPolygonId: string;
  selectedHexagonIndex: string;

  setH3Index: (h3Index: number) => void;
  setIsAutoH3Index: (isAutoH3Index: boolean) => void;
  setPolygons: (polygons: Feature[]) => void;
  setRequiredIndexOnZoom: (requiredIndexOnZoom: number) => void;
  toggleIsAutoH3Index: () => void;
  updateState: (partialState: Partial<HexagonsState>) => void;
  setLastZoom: (lastZoom: number) => void;
  setSelectedPolygon: (selectedPolygon: Feature | null) => void;
  setSelectedHexagonIndex: (index: string) => void;
  setSelectedPolygonId: (selectedPolygonId: string) => void;
  wipeTopics: () => void;
}

export const useHexagonsStore = create<HexagonsState>((set) => ({
  polygons: [],
  h3Index: 2,
  isAutoH3Index: true,
  requiredIndexOnZoom: 1,
  lastZoom: 0,
  selectedPolygon: null,
  selectedPolygonId: "-1",
  selectedHexagon: null,
  selectedHexagonIndex: "",

  setSelectedHexagonIndex: (selectedHexagonIndex) =>
    set({ selectedHexagonIndex }),
  setSelectedPolygon: (selectedPolygon) => set({ selectedPolygon }),
  setH3Index: (h3Index) => set({ h3Index }),
  setIsAutoH3Index: (isAutoH3Index) => set({ isAutoH3Index }),
  setPolygons: (polygons) => set({ polygons }),
  setRequiredIndexOnZoom: (requiredIndexOnZoom) => set({ requiredIndexOnZoom }),
  toggleIsAutoH3Index: () =>
    set((state) => ({ isAutoH3Index: !state.isAutoH3Index })),
  updateState: (partialState) =>
    set((state) => ({ ...state, ...partialState })),
  setLastZoom: (lastZoom) => set({ lastZoom }),
  setSelectedPolygonId: (selectedPolygonId) => set({ selectedPolygonId }),
  wipeTopics: () => set({ polygons: [] }),
}));
