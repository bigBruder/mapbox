import { StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

const styles = StyleSheet.create({
  tagContainer: {
    display: "flex",
    flexDirection: "row",
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.secondary,
    borderStyle: "solid",
    opacity: 0.8,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 10,
    paddingRight: 10,
  },
  tagText: {
    fontSize: 16,
    lineHeight: 20,
    color: colors.black,
    fontWeight: "400",
  },
  active: {
    backgroundColor: colors.primary,
    color: colors.white,
    opacity: 1,
  },
  activeText: {
    color: colors.white,
  },
});

export default styles;
