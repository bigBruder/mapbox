import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  ScrollView,
} from "react-native";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import LikeIcon from "../assets/icons/like";
import { ShareIcon } from "../assets/icons";
import MoreIcon from "../assets/icons/more";
import { VibesItem } from "../types/searchResponse";
import { getIconUrl } from "./getIconUrl";
import { getVibeDetails } from "../api/client";
import {
  PorstDetailsValue,
  PostDetailsResponse,
} from "../types/responses/PostDetailsResponse";
import BottomSheet, {
  BottomSheetFooter,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { formatTagsInText } from "./formatTagsInText";
import { formatDate } from "./formatDate";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MAX_TRANSLATE_Y = SCREEN_HEIGHT / 1.5;
const MIN_TRANSLATE_Y = SCREEN_HEIGHT / 5;
type sIPoints = {
  selectedMarker: VibesItem;
  setSelectedMarker: (pin: VibesItem | null) => void;
};

export const ModalDataMarker: FC<sIPoints> = ({
  selectedMarker,
  setSelectedMarker,
}) => {
  const snapPoints = ["35%", "60%"];
  const bottomSheetRef = useRef<BottomSheet>(null);

  // callbacks
  const handleSheetChanges = useCallback(
    (index: number) => {},
    [selectedMarker]
  );

  const [vibeDetails, setVibeDetails] = useState<PorstDetailsValue | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [isShortDescription, setIsShortDescription] = useState(false);

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
  const handleClosePress = () => setSelectedMarker(null);

  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onClose={() => {
          setSelectedMarker(null);
        }}
        animateOnMount={true}
        footerComponent={(props) => (
          <BottomSheetFooter {...props} style={styleContent.bottomContainer}>
            <View style={styleContent.bottomLeftContainer}>
              <View style={styleContent.actionContainer}>
                <LikeIcon />
                <Text>{vibeDetails?.likes}</Text>
              </View>
              <View
                style={{
                  ...styleContent.actionContainer,
                  ...styleContent.space,
                }}
              >
                <ShareIcon />
                <Text>{vibeDetails?.shares}</Text>
              </View>
            </View>
            <MoreIcon />
          </BottomSheetFooter>
        )}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={[styleContent.sheetContainer]}>
            <View style={styleContent.topBox}>
              <Image
                source={{ uri: getIconUrl(selectedMarker.icon.split(":")[1]) }}
                style={{ width: 50, height: 50 }}
              />
              <View>
                <Text>{vibeDetails?.author["userName"]}</Text>
                <Text style={styleContent.venueName}>
                  {vibeDetails?.venue.name}
                </Text>
                <Text>Rank: {vibeDetails?.points}</Text>
                <Text>IsTop: {vibeDetails?.isTop ? "yes" : "no"}</Text>
              </View>
            </View>
            <View style={styleContent.dateContainer}>
              {vibeDetails?.startsAt && (
                <Text style={{ color: "#005DF2" }}>
                  {formatDate(vibeDetails?.startsAt, vibeDetails?.expiresAt)}
                </Text>
              )}
            </View>
            <ScrollView>
              {vibeDetails?.message && (
                <Text style={styleContent.venueMessage}>
                  {formatTagsInText(
                    isShortDescription
                      ? vibeDetails?.message.slice(0, 100) + "..."
                      : vibeDetails?.message
                  )}
                  {vibeDetails.message}
                </Text>
              )}
            </ScrollView>
          </View>
        </BottomSheetView>
      </BottomSheet>
      {/* {selectedMarker && (
        
      )} */}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});

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
    backgroundColor: "white",
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 30,

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
