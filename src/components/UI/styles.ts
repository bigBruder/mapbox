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
    fontWeight: "600",
    lineHeight: 19,
  },
});

export default styles;
