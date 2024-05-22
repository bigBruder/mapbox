import {
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  View,
} from "react-native";
import { getIconUrl } from "../../utils/getIconUrl";
import { VibesItem } from "../../types/searchResponse";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { getMarkerSizeByPoints } from "../../helpers/getMarkerSizeByPoints";

export const Marker = ({
  pin,
  setSelectedMarker,
  zoom,
  isSelected = false,
}: {
  pin: VibesItem;
  setSelectedMarker: (pin: VibesItem | null) => void;
  zoom: number;
  isSelected: boolean;
}) => {
  return (
    <TouchableOpacity
      style={isSelected ? styles.activePinContainer : styles.pinContainer}
      onPress={() => setSelectedMarker(pin)}
    >
      {isSelected ? (
        <>
          <ImageBackground
            source={require("../../assets/active_pin_background.png")}
          >
            <View
              style={{
                width: 50,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={{
                  uri: getIconUrl(pin.icon.split(":")[1]),
                }}
                style={[
                  {
                    width: getMarkerSizeByPoints(pin.points, zoom),
                    height: getMarkerSizeByPoints(pin.points, zoom),
                    objectFit: "cover",
                  },
                  styles.activePinImage,
                ]}
              />
            </View>
          </ImageBackground>
        </>
      ) : (
        <Image
          source={{
            uri: getIconUrl(pin.icon.split(":")[1]),
          }}
          style={{
            width: getMarkerSizeByPoints(pin.points, zoom),
            height: getMarkerSizeByPoints(pin.points, zoom),
            objectFit: "cover",
          }}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pinContainer: {
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
  activePinContainer: {
    backgroundColor: "none",
  },
  activePinImage: {
    width: 30,
    height: 30,
  },
  annotationText: {
    fontSize: 24,
  },
});
