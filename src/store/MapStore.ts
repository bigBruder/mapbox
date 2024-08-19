import { getPinsForBound } from "@/api/client";
import { CameraBound, QueryParams } from "@/types";
import {
  Heatmap,
  HeatmapData,
  VibesItem,
} from "@/types/responses/SearchResponse";
import { create } from "zustand";

interface MapState {
  vibes: { [key: number]: VibesItem[] };
  heatMap: HeatmapData;
  initialHeatMap: {
    [key: string]: Heatmap; // key is resolution level
  };
  tags: string[];
  selectedTag: string | null;
  totalResults: number;
  totalResultsInVisibleArea: number;
  customDate: {
    startDate: Date;
    endDate: Date;
  };
  selectedDate: string;
  camera: CameraBound | null;
  selectedProjection: "globe" | "mercator";
  setSelectedDate: (date: string) => void;
  setVibes: (realTimeZoom: number, newVibes: VibesItem[]) => void;
  setInitialHeatMap: (resolution: number, heatmapData: HeatmapData) => void;
  setCustomDate: (startDate: Date, endDate: Date) => void;
  getVibes: (gridIndex: number) => VibesItem[] | undefined;
  setSelectedTag: (tag: string | null) => void;
  fetchVibes: (realTimeZoom: number, queryParams: QueryParams) => Promise<void>;
  clearData: () => void;
  clearCustomDate: () => void;
  setCamera: (camera: CameraBound | null) => void;
  toggleSelectedProjection: () => void;
}

export const useMapStore = create<MapState>((set, get) => ({
  vibes: {},
  heatMap: {},
  totalResults: 0,
  totalResultsInVisibleArea: 0,
  tags: [],
  initialHeatMap: {},
  selectedTag: "",
  customDate: {
    startDate: new Date(),
    endDate: new Date(),
  },
  selectedDate: "Now",
  camera: null,
  selectedProjection: "globe",
  setVibes: (realTimeZoom: number, newVibes: VibesItem[]) => {
    const gridIndex = Math.max(1, Math.round(realTimeZoom));
    set((state) => ({
      vibes: {
        ...state.vibes,
        [gridIndex]: [...(state.vibes[gridIndex] || []), ...newVibes],
      },
    }));
  },

  setSelectedDate: (date: string) => {
    set(() => ({
      selectedDate: date,
    }));
  },
  setSelectedTag: (tag: string | null) => {
    set(() => ({
      selectedTag: tag,
    }));
  },
  setTotalResults: (totalResults: number) => {
    set(() => ({
      totalResults: totalResults,
    }));
  },
  setTotalResultsInBounds: (totalResultsInVisibleArea: number) => {
    set(() => ({
      totalResultsInVisibleArea: totalResultsInVisibleArea,
    }));
  },

  setInitialHeatMap: (resolution, heatmapData) => {
    set((state) => ({
      initialHeatMap: {
        ...state.initialHeatMap,
        [resolution]: heatmapData,
      },
    }));
  },
  setCustomDate: (startDate, endDate) => {
    set(() => ({
      customDate: {
        startDate: startDate,
        endDate: endDate,
      },
    }));
  },
  setCamera: (camera: CameraBound | null) => {
    set(() => ({
      camera: camera,
    }));
  },

  getVibes: (gridIndex: number) => {
    let normalizedGridIndex = gridIndex;
    if (normalizedGridIndex < 0) {
      normalizedGridIndex = 0;
    }
    if (normalizedGridIndex > 10) {
      normalizedGridIndex = 9;
    }

    const vibes = get().vibes;
    return (
      Object.keys(vibes)
        .filter((key) => Number(key) <= gridIndex)
        .flatMap((key) => vibes[Number(key)]) || []
    );
  },

  toggleSelectedProjection: () => {
    set((state) => ({
      selectedProjection: state.selectedProjection === "globe" ? "mercator" : "globe",
    }));
  },

  getAllVibes: () => Object.values(get().vibes).flat(),
  fetchVibes: async (realTimeZoom: number, queryParams: QueryParams) => {
    const response = await getPinsForBound(queryParams);
    if (!response) return;
    const heatmap = response.value?.heatmap.data || [];
    const totalResultsInVisibleArea = response.value?.totalResults || 0;
    const selectedProjection = "globe";

    let gridIndex = Math.min(10, Math.max(0, Math.floor(realTimeZoom)));

    if (gridIndex > 9) {
      gridIndex = 9;
    }
    if (gridIndex < 0) {
      gridIndex = 0;
    }

    set(() => ({
      tags: Object.keys(response.value?.tags) || [],
    }));

    set(() => ({
      totalResultsInVisibleArea: totalResultsInVisibleArea,
    }));

    set(() => ({
      heatMap: heatmap,
    }));

    const vibes: VibesItem[] = response?.value?.vibes;
    if (!vibes) return;

    set((state) => {
      const oldVibes = state.vibes[gridIndex] || [];
      const oldVibesIds = new Set(oldVibes.map((vibe) => vibe.id));
      const filteredNewVibes =
        vibes.filter((vibe) => !oldVibesIds.has(vibe.id)) || [];
      const resultedVibes = [...oldVibes, ...filteredNewVibes];
      const cutedVibes = resultedVibes.slice(-100);

      return {
        vibes: {
          ...state.vibes,
          [gridIndex]: cutedVibes,
        },
      };
    });
  },

  clearData: () => {
    set(() => ({
      vibes: {},
      heatMap: {},
      initialHeatMap: {},
    }));
  },
  clearCustomDate: () => {
    set(() => ({
      customDate: {
        startDate: new Date(),
        endDate: new Date(),
      },
    }));
  },
}));
