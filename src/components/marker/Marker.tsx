import {
  Image,
  TouchableOpacity,
  ImageBackground,
  Animated,
  View,
} from "react-native";
import { getIconUrl } from "../../utils/getIconUrl";
import { VibesItem } from "../../types/searchResponse";
import { getMarkerSizeByPoints } from "../../helpers/getMarkerSizeByPoints";
import { useEffect, useRef, useState } from "react";

import styles from "./styles";

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
  const [isImageLoading, setIsImageLoading] = useState(true);
  const opacity = useRef(new Animated.Value(0)).current;
  console.log(getMarkerSizeByPoints(pin.points, zoom));
  return (
    <TouchableOpacity
      style={isSelected ? styles.activePinContainer : styles.pinContainer}
      onPress={() => {
        if (isSelected) {
          setSelectedMarker(null);
        } else {
          setSelectedMarker(pin);
        }
      }}
    >
      {isSelected ? (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ImageBackground
            source={require("../../assets/selected_pin_background.png")}
            style={{
              width: 55,
              height: 60,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={{
                uri: getIconUrl(pin.icon.split(":")[1]),
              }}
              style={[styles.activePinImage]}
              onLoadEnd={() => {
                setIsImageLoading(false);
              }}
            />
          </ImageBackground>
        </View>
      ) : (
        <View
          style={{
            width: getMarkerSizeByPoints(pin.points, zoom),
            height: getMarkerSizeByPoints(pin.points, zoom),
            backgroundColor: "white",
            padding: 5,
            borderRadius: 10,
          }}
        >
          <Image
            source={{
              uri: getIconUrl(pin.icon.split(":")[1]),
            }}
            style={{
              flex: 1,
              // width: getMarkerSizeByPoints(pin.points, zoom, isTop),
              // height: getMarkerSizeByPoints(pin.points, zoom, isTop),
              objectFit: "cover",
            }}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};
