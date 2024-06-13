import { create } from "zustand";

export enum ToastType {
  ERROR = "error",
  SUCCESS = "success",
  INFO = "info",
  WARNING = "warn",
}

interface ToastState {
  toast: {
    message: string;
    type: ToastType;
  };
  setError: (props: { message: string; type: ToastType }) => void;
}

export const useErrorStore = create<ToastState>()((set) => ({
  toast: {
    message: "",
    type: ToastType.INFO,
  },
  setError: (props) =>
    set(() => ({
      toast: {
        message: props.message,
        type: props.type,
      },
    })),
}));
