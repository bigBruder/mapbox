import { StyleSheet } from "react-native";
import { colors } from "../../constants/colors";

export const styles = StyleSheet.create({
  bottomContainer: {
    position: "absolute",
    width: "100%",
    bottom: 40,
    padding: 24,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  pointText: {
    fontSize: 18,
    lineHeight: 22,
    color: colors.white,
  },

  searchButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.white,
    borderRadius: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  addButton: {
    width: 48,
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  regionContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    flex: 1,
  },
});
