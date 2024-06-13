import ToastManager from "toastify-react-native";
import styles from "./styles";

export const Toaster = () => {
  return <ToastManager style={styles.container} textStyle={styles.message} />;
};
