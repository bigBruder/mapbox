import { Dimensions, StyleSheet, Text, View, Image } from "react-native";
import React, { FC, useEffect, useState } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { IPoints } from "../types/Points";
import LikeIcon from "../assets/icons/like";
import { ShareIcon } from "../assets/icons";
import MoreIcon from "../assets/icons/more";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MAX_TRANSLATE_Y = SCREEN_HEIGHT / 1.5;
const MIN_TRANSLATE_Y = SCREEN_HEIGHT / 5;

interface BottomsheetProps {
  selectedMarker: IPoints;
  onClose: () => void;
}

export default function Bottomsheet({
  selectedMarker,
  onClose,
}: BottomsheetProps) {
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });

  const gesture = Gesture.Pan()
    .onStart((e) => {
      context.value = { y: translateY.value };
    })
    .onUpdate((e) => {
      translateY.value = e.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, -MAX_TRANSLATE_Y);
    })
    .onEnd((e) => {
      if (translateY.value > -MIN_TRANSLATE_Y) {
        translateY.value = withSpring(SCREEN_HEIGHT);
      }
      if (translateY.value < -MIN_TRANSLATE_Y) {
        translateY.value = withSpring(-MAX_TRANSLATE_Y);
      }
    });

  /**
   * Animated style for the bottom sheet
   */
  const reanimatedBottomStyle = useAnimatedStyle((e) => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  /**
   * Scrolls to a specific destination
   * @param {number} destination - The destination to scroll to
   */
  const scrollTo = (destination) => {
    "worklet";
    translateY.value = withSpring(destination, { damping: 50 });
  };

  useEffect(() => {
    // Initial scroll to show the bottom sheet partially
    scrollTo(-SCREEN_HEIGHT / 3);
  }, [selectedMarker, onClose]);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[styles.bottomsheet_container, reanimatedBottomStyle]}
      >
        <ModalDataMarker selectedMarker={selectedMarker} />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  bottomsheet_container: {
    width: "100%",
    height: SCREEN_HEIGHT,
    backgroundColor: "white",
    position: "absolute",
    top: SCREEN_HEIGHT / 1,
    zIndex: 12000,
    borderRadius: 25,
    paddingHorizontal: 10,
  },
});

type sIPoints = {
  selectedMarker: IPoints;
};

const ModalDataMarker: FC<sIPoints> = ({
  selectedMarker,
}: {
  selectedMarker: IPoints;
}) => {
  return (
    <View style={styleContent.sheetContainer}>
      <View style={styleContent.line} />

      <View style={styleContent.topBox}>
        <Image
          source={{ uri: selectedMarker.iconUrl }}
          style={{ width: 50, height: 50 }}
        />
        <Text>
          <Text style={{ fontWeight: "bold" }}>Name:</Text>{" "}
          {selectedMarker.name}
        </Text>
      </View>
      <View>
        <Text>
          <Text style={{ fontWeight: "bold" }}>Type:</Text>{" "}
          {selectedMarker.type}
        </Text>
        <Text>
          <Text style={{ fontWeight: "bold" }}>Place Name:</Text>{" "}
          {selectedMarker.placeName}
        </Text>
        <Text>
          <Text style={{ fontWeight: "bold" }}>Address:</Text>{" "}
          {selectedMarker.address}
        </Text>
      </View>
      <View>
        <Text>{selectedMarker.description}</Text>
      </View>
      <View style={styleContent.bottomContainer}>
        <View style={styleContent.bottomLeftContainer}>
          <View style={styleContent.actionContainer}>
            <LikeIcon />
            <Text>123</Text>
          </View>
          <View
            style={{ ...styleContent.actionContainer, ...styleContent.space }}
          >
            <ShareIcon />
            <Text>123</Text>
          </View>
        </View>
        <MoreIcon />
      </View>
    </View>
  );
};

const styleContent = StyleSheet.create({
  sheetContainer: {
    padding: 10,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: "grey",
    borderRadius: 20,
    alignSelf: "center",
    marginVertical: 10,
  },
  topBox: {
    width: "100%",
    height: "auto",
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
  },
  bottomContainer: {
    marginTop: 10,
    width: "100%",
    height: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  bottomLeftContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
  },
  actionContainer: {
    display: "flex",
  },
  space: {
    marginLeft: 56,
  },
});
