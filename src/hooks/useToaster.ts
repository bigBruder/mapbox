import { useEffect } from "react";
import { ToastType, useErrorStore } from "@/store/ErrorStore";
import { Toast } from "toastify-react-native";

export const useToaster = () => {
  const setToast = useErrorStore((state) => state.setError);
  const toast = useErrorStore((state) => state.toast);

  useEffect(() => {
    if (toast.message) {
      Toast[toast.type](toast.message, "top");
    }
    return () => {
      setToast({ message: "", type: ToastType.INFO });
    };
  }, [toast.message, toast.type]);

  return { useToaster };
};
