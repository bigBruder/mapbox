import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  pinContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  activePinContainer: {
    width: 100,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    transform: [{ translateY: -10 }],
  },
  activePinImage: {
    height: 20,
    width: 20,
    transform: [{ translateY: -3 }],
    objectFit: "cover",
  },
  annotationText: {
    fontSize: 24,
  },
});

export default styles;
