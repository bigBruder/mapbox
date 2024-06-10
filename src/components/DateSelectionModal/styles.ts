import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "#D9DBEB80",
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    height: 70,
  },
  headerText: {
    fontWeight: "600",
    fontSize: 18,
    color: "#333659",
  },
  headerCancel: {
    fontWeight: "600",
    fontSize: 16,
    color: "#333659",
  },
  modalContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    height: "80%",
    gap: 15,
  },
  buttonDate: {
    position: "relative",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    borderBlockColor: "#D9DBEB",
    borderWidth: 1,
    borderRadius: 8,
    height: 48,
  },
  textDate: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333659",
  },
  icon: {
    position: "absolute",
    top: 10,
    left: 15,
  },
  containerPiker: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
  containerDatePiker: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "76%",
  },
  buttonApplyDate: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: "80%",
    borderRadius: 30,
    backgroundColor: "#005DF2",
    marginTop: 10,
  },
  textApplyDate: {
    fontWeight: "600",
    fontSize: 16,
    color: "#fff",
  },
  dateTime: {
    fontWeight: "600",
    fontSize: 15,
    color: "#005DF2",
  },
});

export default styles;
