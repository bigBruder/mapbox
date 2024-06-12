import { StyleSheet } from "react-native";
import { colors } from "../../constants/colors";

const styles = StyleSheet.create({
  bottomSheet: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  bottomsheetView: {
    gap: 10,
  },
  sheetContainer: {
    height: "100%",
    flexDirection: "column",
    marginBottom: 100,
    gap: 10,
  },
  safeBottomSheetContainer: {
    flexDirection: "column",
    gap: 10,
  },
  topBox: {
    width: "100%",
    height: "auto",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10,
    gap: 10,
  },
  bottomContainer: {
    backgroundColor: "white",
    paddingTop: 20,
    paddingBottom: 50,
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
  dateContainerStarted: {
    paddingHorizontal: 0,
    backgroundColor: "none",
  },
  message: {
    fontWeight: "400",
    fontSize: 16,
  },
  icon: {
    width: 40,
    height: 40,
  },
  topRightContainer: {
    flex: 1,
    gap: 5,
    justifyContent: "center",
  },
  date: {
    color: colors.primary,
    fontSize: 14,
    lineHeight: 18.2,
    paddingVertical: 2,
  },
  dateStarted: {
    color: "#8386A5",
  },
  userName: {
    flexWrap: "wrap",
    fontWeight: "600",
    fontSize: 16,
  },
  imageContainer: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  text: {
    flexWrap: "wrap",
  },
});

export default styles;
