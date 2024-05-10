import { StyleSheet, Image, TouchableOpacity } from "react-native";
import { getIconUrl } from "../../utils/getIconUrl";
import { VibesItem } from "../../types/searchResponse";

export const Marker = ({
  pin,
}: {
  pin: VibesItem;
  setSelectedMarker: (pin: VibesItem | null) => void;
}) => {
  return (
    <TouchableOpacity style={styles.annotationContainer}>
      <Image
        source={{
          uri: getIconUrl(pin.icon.split(":")[1]),
        }}
        style={{ width: 20, height: 20 }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  annotationContainer: {
    width: 30,
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 0,
    borderColor: "white",
    borderStyle: "solid",
  },
  annotationText: {
    fontSize: 24,
  },
});
