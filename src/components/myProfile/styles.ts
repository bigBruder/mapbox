import { colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: colors.white,

    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1,
  },
  headerLeftContainer: {
    flexDirection: "row",
    gap: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  historyList: {
    padding: 20,
  },
});

export default styles;
