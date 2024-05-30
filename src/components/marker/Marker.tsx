import {
  Image,
  TouchableOpacity,
  ImageBackground,
  Animated,
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
  isTop,
  isSelected = false,
}: {
  pin: VibesItem;
  setSelectedMarker: (pin: VibesItem | null) => void;
  zoom: number;
  isSelected: boolean;
  isTop: boolean;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isImageLoading, setIsImageLoading] = useState(true);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: -5,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    return () => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    };
  }, [fadeAnim, isSelected, pin.id]);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [opacity, pin.id]);

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
              display: isImageLoading && !isSelected ? "none" : "flex",
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
          </Animated.View>
        </>
      ) : (
        <Animated.View
          style={{
            opacity: opacity,
            width: getMarkerSizeByPoints(pin.points, zoom, isTop),
            height: getMarkerSizeByPoints(pin.points, zoom, isTop),
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
        </Animated.View>
      )}
    </TouchableOpacity>
  );
};
