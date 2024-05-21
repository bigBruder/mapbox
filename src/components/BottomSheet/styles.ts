import { NativeModules, StyleSheet } from "react-native";
const { StatusBarManager } = NativeModules;

const styles = StyleSheet.create({
  sheetContainer: {
    padding: 10,
    display: "flex",
    flexDirection: "column",
    // marginBottom: 95,
    gap: 10,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: "grey",
    borderRadius: 20,
    alignSelf: "center",
    marginVertical: 10,
  },
  topBox: {
    width: "100%",
    height: "auto",
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
  },
  bottomContainer: {
    backgroundColor: "white",
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 30,

    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  bottomLeftContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
  },
  actionContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  space: {
    marginLeft: 56,
  },
  dateContainer: {
    backgroundColor: "#0559E326",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  icon: {
    width: 50,
    height: 50,
  },
});

export default styles;
