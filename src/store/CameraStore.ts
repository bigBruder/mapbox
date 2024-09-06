import { CameraBound } from "@/types";
import { create } from "zustand";

interface CameraState {
  realTimeZoom: number;
  realTimeZoomDebug: number;
  realtimeCamera: CameraBound | null;

  setRealtimeCamera: (realTimeCamera: CameraBound | null) => void;
  setRealTimeZoom: (realTimeZoom: number) => void;
  setRealTimeZoomDebug: (realTimeZoomDebug: number) => void;
}

export const useCameraStore = create<CameraState>()((set) => ({
  realTimeZoom: 0,
  realTimeZoomDebug: 0,
  realtimeCamera: null,
  setRealtimeCamera: (realtimeCamera) =>
    set(() => ({
      realtimeCamera: realtimeCamera,
    })),
  setRealTimeZoom: (realTimeZoom) =>
    set(() => ({
      realTimeZoom: realTimeZoom,
    })),
  setRealTimeZoomDebug: (realTimeZoomDebug) =>
    set(() => ({
      realTimeZoomDebug: realTimeZoomDebug,
    })),
}));
