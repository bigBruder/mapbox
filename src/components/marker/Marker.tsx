import { Image, TouchableOpacity, ImageBackground, View } from "react-native";
import { getIconUrl } from "../../utils/getIconUrl";
import { VibesItem } from "../../types/searchResponse";
import { getMarkerSizeByPoints } from "../../helpers/getMarkerSizeByPoints";
import { useMemo, useState } from "react";

import styles from "./styles";
import { colors } from "../../constants/colors";

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
  const [isImageLoading, setIsImageLoading] = useState(true);

  const isAlreadyStarted = new Date(pin.startsAt) < new Date();

  const imageUrl = useMemo(() => {
    return getIconUrl(pin.icon.split(":")[1]);
  }, [pin.id]);

  const borderWidth = !isImageLoading ? (isAlreadyStarted ? 0.5 : 1) : 0;
  const borderColor = isAlreadyStarted ? colors.primary : colors.secondary;
  const size = getMarkerSizeByPoints(pin.points, zoom);

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
        <View>
          <ImageBackground
            source={
              isAlreadyStarted
                ? require("../../assets/selected_pin_background_started.png")
                : require("../../assets/selected_pin_background.png")
            }
            style={styles.activePinBackground}
          >
            <Image
              source={{
                uri: getIconUrl(pin.icon.split(":")[1]),
              }}
              style={styles.activePinImage}
              onLoadEnd={() => {
                setIsImageLoading(false);
              }}
            />
          </ImageBackground>
        </View>
      ) : (
        <View
          style={{
            width: size,
            height: size,
            backgroundColor: isImageLoading ? "transparent" : colors.white,
            borderWidth: borderWidth,
            borderColor: borderColor,
            ...styles.imageContainer,
          }}
        >
          <Image
            source={{
              uri: imageUrl,
            }}
            onLoadEnd={() => {
              setIsImageLoading(false);
            }}
            style={[styles.pinImage]}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};
