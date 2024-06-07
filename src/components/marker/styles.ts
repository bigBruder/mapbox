import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  pinContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  activePinContainer: {
    padding: 5,
    transform: [{ translateY: -10 }],
  },
  activePinImage: {
    height: 30,
    width: 30,
    transform: [{ translateY: -3 }],
    objectFit: "cover",
  },
  annotationText: {
    fontSize: 24,
  },
});

export default styles;
