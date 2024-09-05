import { create } from "zustand";

interface CameraState {
  realTimeZoom: number;
  realTimeZoomDebug: number;

  setRealTimeZoom: (realTimeZoom: number) => void;
  setRealTimeZoomDebug: (realTimeZoomDebug: number) => void;
}

export const useCameraStore = create<CameraState>()((set) => ({
  realTimeZoom: 0,
  realTimeZoomDebug: 0,
  setRealTimeZoom: (realTimeZoom) =>
    set(() => ({
      realTimeZoom: realTimeZoom,
    })),
  setRealTimeZoomDebug: (realTimeZoomDebug) =>
    set(() => ({
      realTimeZoomDebug: realTimeZoomDebug,
    })),
}));
