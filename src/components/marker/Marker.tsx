import MapboxGL from "@rnmapbox/maps";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { getIconUrl } from "../../utils/getIconUrl";
import Mapbox from "@rnmapbox/maps";
import { VibesItem } from "../../types/searchResponse";

export const Marker = ({
  pin,
  setSelectedMarker,
}: // selectedMarker,
{
  pin: VibesItem;
  setSelectedMarker: (pin: VibesItem | null) => void;
}) => {
  return (
    <TouchableOpacity
      // onPress={() => {
      //   if (selectedMarker === pin) {
      //     setSelectedMarker(null);
      //   } else {
      //     setSelectedMarker(pin);
      //   }
      // }}
      style={styles.annotationContainer}
    >
      {/* {pin.id === selectedMarker?.id ? (
        <ImageBackground
          source={require("../../assets/active_pin_background.png")}
          style={{
            width: 30,
            height: 30,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          resizeMethod="resize"
        >
          <Image
            source={{
              uri: getIconUrl(pin.icon.split(":")[1]),
            }}
            style={{ width: 20, height: 20 }}
          />
        </ImageBackground>
      ) : ( */}
      <Image
        source={{
          uri: getIconUrl(pin.icon.split(":")[1]),
        }}
        style={{ width: 20, height: 20 }}
      />
      {/* )} */}
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
