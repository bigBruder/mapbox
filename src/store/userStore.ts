import { create } from "zustand";
//for debugging
interface UserState {
  user: boolean;
  toggleUser: () => void;
}

export const useUserStore = create<UserState>()((set) => ({
  user: false,
  toggleUser: () =>
    set((state) => ({
      user: !state.user,
    })),
}));
