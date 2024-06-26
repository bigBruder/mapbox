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
  setMessage: (props: { message: string; type: ToastType }) => void;
  clearMessage: () => void;
}

export const useToastStore = create<ToastState>()((set) => ({
  toast: {
    message: "",
    type: ToastType.INFO,
  },
  setMessage: (props) =>
    set(() => ({
      toast: {
        message: props.message,
        type: props.type,
      },
    })),
  clearMessage: () => {
    set(() => ({
      toast: {
        message: "",
        type: ToastType.INFO,
      },
    }));
  },
}));
