import { NativeModules, StyleSheet } from "react-native";
const { StatusBarManager } = NativeModules;

export const styles = StyleSheet.create({
  topContainer: {
    position: "absolute",
    width: "100%",
    top: StatusBarManager.HEIGHT + 10,
    padding: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    gap: 10,
  },
  upperContainer: {
    width: "100%",
    overflow: "hidden",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
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
  totalResults: {
    gap: 10,
    width: 100,
    flexDirection: "row",
    alignItems: "center",
  },
  searchContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "white",
    height: 40,
    borderColor: "gray",
    borderRadius: 40,
    padding: 10,
    flex: 1,
  },
  search: {
    flex: 1,
    height: 40,
  },
  tagsContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  calendarContainer: {
    height: 28,
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    borderRadius: 30,
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: "600",
  },
  calendarIcon: {
    width: 16,
    height: 16,
    objectFit: "contain",
  },

  resultText: {
    alignSelf: "center",
    fontSize: 12,
  },
  line: {
    width: 1,
    height: 20,
    backgroundColor: "grey",
  },
  resultContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default styles;
