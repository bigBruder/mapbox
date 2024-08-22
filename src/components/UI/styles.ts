import { StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

const styles = StyleSheet.create({
  actionButton: {
    backgroundColor: colors.pulsePrimary,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 19,
    fontFamily: "SF-Text-Bold",
  },
  disabled: {
    backgroundColor: colors.pulseGrey,
  },
});

export default styles;
