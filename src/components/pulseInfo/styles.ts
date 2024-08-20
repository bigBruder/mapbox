import { colors } from "@/constants/colors";
import { NativeModules, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // header region
  headerContainer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: "white",
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1,
  },

  headerContentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
  },
  headerNavigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    height: 35,
  },

  // top region
  topContainer: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 20,
    paddingTop: 20,
  },

  metricText: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.pulseGrey,
  },

  metricTextRich: {
    fontWeight: "600",
  },

  imageContainer: {
    width: 110,
    height: 110,
    backgroundColor: colors.white,
  },

  metricContainer: {
    alignItems: "center",
    alignContent: "center",
    gap: 6,
  },

  metricsContainer: {
    flex: 1,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
  },

  // content region

  contentContainer: {
    flexDirection: "column",
    paddingHorizontal: 20,
    gap: 10,
  },

  pulseTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.pulseBlack,
  },

  authorContainer: {
    gap: 8,
    flexDirection: "row",
  },

  authorName: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.pulseGrey,
  },

  contentText: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 16,
    color: colors.black,
  },

  // footer region
  footerContainer: {
    height: 108,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,

    backgroundColor: "white",
    borderTopColor: colors.lightGrey,
    borderTopWidth: 1,
  },

  footerButton: {
    width: "100%",
    alignItems: "center",
    padding: 15,
    borderRadius: 40,
    backgroundColor: colors.pulsePrimary,
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
});

export default styles;
