import { StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: colors.white,

    // borderBottomColor: colors.lightGrey,
    // borderBottomWidth: 1,
  },
  leftContainer: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    padding: 20,
    gap: 10,
  },
  title: {
    fontSize: 20,
    lineHeight: 24,
    fontFamily: "SF-Text-Bold",
  },
});

export default styles;
