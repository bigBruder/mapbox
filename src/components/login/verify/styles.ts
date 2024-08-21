import { StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.white,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    color: colors.pulseBlack,
    lineHeight: 38.19,
  },
  description: {
    color: colors.pulseGrey,
    fontSize: 14,
    lineHeight: 16.71,
    marginTop: 8,
    textAlign: "center",
  },
  topContainer: {
    alignContent: "center",
    alignItems: "center",
  },
  actionText: {
    color: colors.pulsePrimary,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 19.09,
    textAlign: "center",
  },

  // library styles
  root: { width: "40%" },
  codeFieldRoot: { marginTop: 20, gap: 20, justifyContent: "space-between" },
  cell: {
    width: 56,
    height: 48,
    lineHeight: 38,
    fontSize: 16,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: colors.lightGrey,
    textAlign: "center",
  },
  focusCell: {
    borderColor: colors.pulsePrimary,
  },
});

export default styles;
