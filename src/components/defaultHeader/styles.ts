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
});

export default styles;
