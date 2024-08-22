import { colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",

    backgroundColor: colors.white,
  },
  contentContainer: {
    paddingVertical: 16,
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 16,
    lineHeight: 19,
    fontWeight: "600",
    color: colors.pulseBlack,
    fontFamily: "SF-Text-Medium",
  },
  description: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 16.71,
    color: colors.pulseGrey,
    fontFamily: "SF-Text",
  },
  footerContainer: {
    padding: 20,
    height: 108,

    borderTopColor: colors.lightGrey,
    borderTopWidth: 1,
  },
  actionButton: {
    backgroundColor: colors.pulsePrimary,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 19,
    fontFamily: "SF-Text-Bold",
  },
});

export default styles;
