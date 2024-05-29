import { StyleSheet } from "react-native";

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
    color: "white",
  },

  searchButton: {
    width: 40,
    height: 40,
    backgroundColor: "white",
    borderRadius: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  addButton: {
    width: 48,
    height: 48,
    backgroundColor: "#005DF2",
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
