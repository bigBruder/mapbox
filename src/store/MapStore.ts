import { getPinsForBound } from "@/api/client";
import { QueryParams } from "@/types";
import { VibesItem } from "@/types/SearchResponse";
import { create } from "zustand";

interface MapState {
  vibes: { [key: number]: VibesItem[] };
  heatMap: any;
  setVibes: (realTimeZoom: number, newVibes: VibesItem[]) => void;
  getVibes: (gridIndex: number) => VibesItem[] | undefined;
  fetchVibes: (realTimeZoom: number, queryParams: QueryParams) => Promise<void>;
  clearData: () => void;
}

export const useMapStore = create<MapState>((set, get) => ({
  vibes: {},
  heatMap: [],

  setVibes: (realTimeZoom: number, newVibes: VibesItem[]) => {
    const gridIndex = Math.max(1, Math.round(realTimeZoom));
    set((state) => ({
      vibes: {
        ...state.vibes,
        [gridIndex]: [...(state.vibes[gridIndex] || []), ...newVibes],
      },
    }));
  },

  getAllVibes: () => Object.values(get().vibes).flat(),

  getVibes: (gridIndex: number) => {
    if (gridIndex < 0 || gridIndex > 10) {
      console.warn("Grid index out of bounds:", gridIndex);
      return [];
    }
    const vibes = get().vibes;
    return (
      Object.keys(vibes)
        .filter((key) => Number(key) <= gridIndex)
        .flatMap((key) => vibes[Number(key)]) || []
    );
  },

  fetchVibes: async (realTimeZoom: number, queryParams: QueryParams) => {
    const response = await getPinsForBound(queryParams);
    const heatmap = response.value?.heatmap || [];

    const gridIndex = Math.min(10, Math.max(0, Math.floor(realTimeZoom)));

    if (gridIndex < 0 || gridIndex > 10) {
      console.warn("Grid index out of bounds:", gridIndex);
      return;
    }

    set((state) => ({
      heatMap: heatmap,
    }));

    set((state) => {
      const oldVibes = state.vibes[gridIndex] || [];
      const oldVibesIds = new Set(oldVibes.map((vibe) => vibe.id));
      const filteredNewVibes =
        response?.value?.vibes.filter((vibe) => !oldVibesIds.has(vibe.id)) ||
        [];
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
      heatMap: [],
    }));
  },
}));
