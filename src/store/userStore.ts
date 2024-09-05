import { create } from "zustand";
//for debugging
interface UserState {
  user: boolean;
  userLocation: {
    latitude: number;
    longitude: number;
    source: string;
  } | null;
  toggleUser: () => void;
  setUserLocation: (location: {
    latitude: number;
    longitude: number;
    source: string;
  }) => void;
}

export const useUserStore = create<UserState>()((set) => ({
  user: true,
  userLocation: null,
  toggleUser: () =>
    set((state) => ({
      user: !state.user,
    })),
  setUserLocation: (location) =>
    set(() => ({
      userLocation: location,
    })),
}));
