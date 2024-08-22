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
    fontSize: 16,
    lineHeight: 19,
    color: colors.white,
  },

  searchButton: {
    width: 48,
    height: 48,
    backgroundColor: colors.white,
    borderRadius: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  addButton: {
    width: 56,
    height: 56,
    backgroundColor: colors.pulsePrimary,
    borderRadius: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  regionContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginBottom: 8,
    gap: 8,
    flex: 1,

    backgroundColor: "transparent",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
});
