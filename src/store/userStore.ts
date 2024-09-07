import { User } from "@/types/responses/userResponse";
import { create } from "zustand";

interface UserState {
  user: User | null;
  userLocation: {
    latitude: number;
    longitude: number;
    source: string;
  } | null;
  setUser: (user: User | null) => void;
  setUserLocation: (location: {
    latitude: number;
    longitude: number;
    source: string;
  }) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()((set) => ({
  user: null,
  userLocation: null,
  logout: () =>
    set(() => ({
      user: null,
    })),
  setUser: (user) =>
    set(() => ({
      user,
    })),

  setUserLocation: (location) =>
    set(() => ({
      userLocation: location,
    })),
}));
