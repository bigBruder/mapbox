import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    backgroundColor: "rgba(5, 89, 227, 0.05)",
  },
  title: {
    fontWeight: "bold",
  },
  image: {
    height: 150,
    objectFit: "cover",
  },
  link: {
    color: "#005DF2",
  },
});

export default styles;
