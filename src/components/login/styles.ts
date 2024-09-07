import { StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.white,
  },
  logo: {
    width: 170,
    height: 40,
    alignSelf: "center",
  },
  signUpContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    gap: 5,
    flexDirection: "row",
    justifyContent: "center",
    textAlign: "center",
    marginTop: 20,
  },
  actionText: {
    color: colors.pulsePrimary,
    fontWeight: "600",
    lineHeight: 19.09,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontWeight: "400",
    opacity: 0.7,
  },
  title: {
    marginBottom: 32,
    color: colors.pulseBlack,
    fontSize: 32,
    lineHeight: 38.19,
    fontWeight: "600",
  },
  label: {
    color: colors.pulseGrey,
    fontSize: 16,
    lineHeight: 19.09,
    fontWeight: "400",
  },
  input: {
    padding: 15,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    borderRadius: 10,
  },
  fieldContainer: {
    gap: 8,
  },
  buttonsContainer: {
    marginTop: 20,
    gap: 10,
  },
  actionText: {
    color: colors.pulsePrimary,
    fontWeight: "600",
    lineHeight: 19.09,
    textAlign: "center",
  },
  loginWithProviderButton: {
    gap: 10,
    flexDirection: "row",
    backgroundColor: "white",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
});

export default styles;
