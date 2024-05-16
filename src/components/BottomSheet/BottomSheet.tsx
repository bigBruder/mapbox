import { Text, View, Image, ScrollView } from "react-native";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import LikeIcon from "../../assets/icons/like";
import { ShareIcon } from "../../assets/icons";
import MoreIcon from "../../assets/icons/more";
import { VibesItem } from "../../types/searchResponse";
import { getIconUrl } from "../../utils/getIconUrl";
import { getVibeDetails } from "../../api/client";
import {
  PorstDetailsValue,
  PostDetailsResponse,
} from "../../types/responses/PostDetailsResponse";
import BottomSheet, {
  BottomSheetFooter,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { formatTagsInText } from "../../utils/formatTagsInText";
import { formatDate } from "../../utils/formatDate";

import styles from "./styles";

interface Props {
  selectedMarker: VibesItem;
  setSelectedMarker: (v: VibesItem | null) => void;
}

export const ModalDataMarker: FC<Props> = ({
  selectedMarker,
  setSelectedMarker,
}) => {
  const snapPoints = ["35%", "60%"];
  const bottomSheetRef = useRef<BottomSheet>(null);

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

  return (
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
        <BottomSheetFooter {...props} style={styles.bottomContainer}>
          <View style={styles.bottomLeftContainer}>
            <View style={styles.actionContainer}>
              <LikeIcon />
              <Text>{vibeDetails?.likes}</Text>
            </View>
            <View
              style={{
                ...styles.actionContainer,
                ...styles.space,
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
        <View style={[styles.sheetContainer]}>
          <View style={styles.topBox}>
            <Image
              source={{ uri: getIconUrl(selectedMarker.icon.split(":")[1]) }}
              style={{ width: 50, height: 50 }}
            />
            <View>
              <Text>{vibeDetails?.author["userName"]}</Text>
              <Text>{vibeDetails?.venue.name}</Text>
              <Text>Rank: {vibeDetails?.points}</Text>
              <Text>IsTop: {vibeDetails?.isTop ? "yes" : "no"}</Text>
            </View>
          </View>
          <View style={styles.dateContainer}>
            {vibeDetails?.startsAt && (
              <Text style={{ color: "#005DF2" }}>
                {formatDate(vibeDetails?.startsAt, vibeDetails?.expiresAt)}
              </Text>
            )}
          </View>
          <ScrollView>
            {vibeDetails?.message && (
              <Text>
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
  );
};
