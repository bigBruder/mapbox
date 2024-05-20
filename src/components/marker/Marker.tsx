import { StyleSheet, Image, TouchableOpacity } from "react-native";
import { getIconUrl } from "../../utils/getIconUrl";
import { VibesItem } from "../../types/searchResponse";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { getMarkerSizeByPoints } from "../../helpers/getMarkerSizeByPoints";

export const Marker = ({
  pin,
  setSelectedMarker,
}: {
  pin: VibesItem;
  setSelectedMarker: (pin: VibesItem | null) => void;
}) => {
  return (
    <TouchableOpacity
      style={[styles.annotationContainer]}
      onPress={() => setSelectedMarker(pin)}
    >
      <Image
        source={{
          uri: getIconUrl(pin.icon.split(":")[1]),
        }}
        style={{
          width: getMarkerSizeByPoints(pin.points),
          height: getMarkerSizeByPoints(pin.points),
          objectFit: "cover",
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  annotationContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 0,
    borderColor: "white",
    borderStyle: "solid",
    padding: 5,
  },
  annotationText: {
    fontSize: 24,
  },
});
