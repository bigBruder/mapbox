import { colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    padding: 6,
    paddingRight: 10,
    height: 92,

    borderColor: colors.lightGrey,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: colors.white,

    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 10,
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: 8,
  },
  image: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 19,
  },

  rightContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 6,
  },

  infoRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoRowValue: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.pulseGrey,
  },
});

export default styles;
