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
import { Value, VibesItem } from "../types/searchResponse";
import { getIconUrl } from "./getIconUrl";
import { getVibeDetails } from "../api/client";
import {
  PorstDetailsValue,
  PostDetailsResponse,
} from "../types/postDetailsResponse";
import { formatDate } from "./formatDate";
import { formatTagsInText } from "./formatTagsInText";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MAX_TRANSLATE_Y = SCREEN_HEIGHT / 1.5;
const MIN_TRANSLATE_Y = SCREEN_HEIGHT / 5;

interface BottomsheetProps {
  selectedMarker: VibesItem;
  onClose: () => void;
}

const IS_UPPER_THRESHOLD = -100;

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
    flex: 1,
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
  selectedMarker: VibesItem;
};

const ModalDataMarker: FC<sIPoints> = ({ selectedMarker }) => {
  const [vibeDetails, setVibeDetails] = useState<PorstDetailsValue | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [isShortDescription, setIsShortDescription] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const details: PostDetailsResponse = await getVibeDetails(
          selectedMarker.id
        );
        setVibeDetails(details.value);
      } catch (error) {
        console.error("Error fetching vibe details:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedMarker.id]);

  if (loading) return <Text>Loading...</Text>;
  return (
    <View style={styleContent.sheetContainer}>
      <View style={styleContent.line} />

      <View style={styleContent.topBox}>
        <Image
          source={{ uri: getIconUrl(selectedMarker.icon.split(":")[1]) }}
          style={{ width: 50, height: 50 }}
        />
        <View>
          <Text>{vibeDetails?.author["userName"]}</Text>
          <Text>{vibeDetails?.venue.name}</Text>
        </View>
      </View>
      <View style={styleContent.dateContainer}>
        <Text style={{ color: "#005DF2" }}>
          {formatDate(vibeDetails?.expiresAt)}
        </Text>
      </View>
      <View>
        <Text>
          {formatTagsInText(
            isShortDescription
              ? vibeDetails?.message.slice(0, 100) + "..."
              : vibeDetails?.message
          )}
        </Text>
      </View>
      <View style={styleContent.bottomContainer}>
        <View style={styleContent.bottomLeftContainer}>
          <View style={styleContent.actionContainer}>
            <LikeIcon />
            <Text>{vibeDetails?.likes}</Text>
          </View>
          <View
            style={{ ...styleContent.actionContainer, ...styleContent.space }}
          >
            <ShareIcon />
            <Text>{vibeDetails?.shares}</Text>
          </View>
        </View>
        <MoreIcon />
      </View>
    </View>
    // <></>
  );
};

const styleContent = StyleSheet.create({
  sheetContainer: {
    padding: 10,
    display: "flex",
    flex: 1,
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
    alignItems: "center",
  },
  space: {
    marginLeft: 56,
  },
  dateContainer: {
    backgroundColor: "#0559E326",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
});
