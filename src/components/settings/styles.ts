import { colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.white,
  },
  categoryContainer: {
    marginVertical: 12,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: colors.white,
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 10,
  },
  categoryTitle: {
    marginBottom: 10,
    fontSize: 16,
    lineHeight: 19,
    color: colors.pulseGrey,
  },
  settingsList: {
    gap: 15,
  },
  accountRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftContainer: {
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.pulseGrey,
  },
  value: {
    fontSize: 16,
    color: colors.pulseBlack,
    maxWidth: 276,
  },
  valueAction: {
    fontSize: 12,
    color: colors.pulseGrey,
  },
  titleAction: {
    fontWeight: "600",
    color: colors.pulseBlack,
  },
});

export default styles;
