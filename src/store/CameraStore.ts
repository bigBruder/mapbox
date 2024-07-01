import { create } from "zustand";

interface CameraState {
  realTimeZoom: number;
  setRealTimeZoom: (realTimeZoom: number) => void;
}

export const useCameraStore = create<CameraState>()((set) => ({
  realTimeZoom: 0,
  setRealTimeZoom: (realTimeZoom) =>
    set(() => ({
      realTimeZoom: realTimeZoom,
    })),
}));
