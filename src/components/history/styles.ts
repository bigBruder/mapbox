import { colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  historyContainer: {
    flex: 1,
    gap: 10,
    backgroundColor: "white",
  },
  historyList: {
    gap: 15,
  },
  topContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.pulseGrey,
  },
  subTitle: {
    fontSize: 12,
    color: colors.pulseGrey,
  },
});

export default styles;
