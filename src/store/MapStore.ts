import { getPinsForBound } from "@/api/client";
import { QueryParams } from "@/types";
import { VibesItem } from "@/types/SearchResponse";
import { create } from "zustand";

interface MapState {
  vibes: { [key: number]: VibesItem[] }; // Об'єкт для зберігання vibes за grid index
  setVibes: (realTimeZoom: number, newVibes: VibesItem[]) => void;
  getVibes: (gridIndex: number) => VibesItem[] | undefined;
  fetchVibes: (realTimeZoom: number, queryParams: QueryParams) => Promise<void>;
}

export const useMapStore = create<MapState>((set, get) => ({
  vibes: {},

  setVibes: (realTimeZoom: number, newVibes: VibesItem[]) =>
    set((state) => {
      const gridIndex = Math.round(realTimeZoom);
      if (gridIndex < 1 || gridIndex > 10) {
        console.warn("Grid index out of bounds:", gridIndex);
        return state;
      }

      return {
        vibes: {
          ...state.vibes,
          [gridIndex]: [...(state.vibes[gridIndex] || []), ...newVibes],
        },
      };
    }),
  getAllVibes: () => {
    const vibes = get().vibes;

    return Object.values(vibes).flat();
  },
  getVibes: (gridIndex: number) => {
    if (gridIndex < 1 || gridIndex > 10) {
      console.warn("Grid index out of bounds:", gridIndex);
      return [];
    }

    const vibes = get().vibes;
    const keysToDisplay = Object.keys(vibes).filter(
      (key) => Number(key) <= gridIndex
    );
    const filteredVibes = keysToDisplay.map((key) => vibes[Number(key)]).flat();
    return filteredVibes.length > 0 ? filteredVibes : [];
  },

  fetchVibes: async (realTimeZoom: number, queryParams: QueryParams) => {
    const response = await getPinsForBound(queryParams);

    set((state) => {
      const gridIndex =
        Math.round(realTimeZoom) > 10 ? 10 : Math.round(realTimeZoom);
      console.log("gridIndex", gridIndex);
      if (gridIndex < 0 || gridIndex > 10) {
        console.warn("Grid index out of bounds:", gridIndex);
        return state;
      }

      const oldVibes = state.vibes[gridIndex] || [];
      const oldVibesIds = oldVibes.map((vibe) => vibe.id);
      const filteredNewVibes =
        response?.value?.vibes.filter(
          (vibe) => !oldVibesIds.includes(vibe.id)
        ) || [];
      const resultedVibes = [...oldVibes, ...filteredNewVibes];
      const cutedVibes =
        resultedVibes.length > 100
          ? resultedVibes.slice(30, 100)
          : resultedVibes;

      return {
        vibes: {
          ...state.vibes,
          [gridIndex]: cutedVibes,
        },
      };
    });
  },
}));
