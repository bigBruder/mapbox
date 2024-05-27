import {
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  View,
  Animated,
} from "react-native";
import { getIconUrl } from "../../utils/getIconUrl";
import { VibesItem } from "../../types/searchResponse";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { getMarkerSizeByPoints } from "../../helpers/getMarkerSizeByPoints";
import { useEffect, useRef } from "react";

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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: -5,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    return () => {
      fadeAnim.setValue(0);
    };
  }, [fadeAnim, isSelected, pin.id]);
  return (
    <TouchableOpacity
      style={isSelected ? styles.activePinContainer : styles.pinContainer}
      onPress={() => setSelectedMarker(pin)}
    >
      {isSelected ? (
        <>
          <Animated.View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              transform: [
                {
                  translateY: fadeAnim,
                },
              ],
            }}
          >
            <ImageBackground
              source={require("../../assets/selected_pin_background.png")}
              style={{
                width: 45,
                height: 50,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={{
                  uri: getIconUrl(pin.icon.split(":")[1]),
                }}
                style={[styles.activePinImage]}
              />
            </ImageBackground>
          </Animated.View>
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
