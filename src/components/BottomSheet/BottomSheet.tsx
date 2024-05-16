import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

import { LikeIcon, ShareIcon, MoreIcon } from "../../assets/icons";
import { getVibeDetails } from "../../api/client";
import { formatDate } from "../../utils/formatDate";
import { formatTagsInText } from "../../utils/formatTagsInText";
import { getIconUrl } from "../../utils/getIconUrl";
import { VibesItem } from "../../types/searchResponse";
import {
  PorstDetailsValue,
  PostDetailsResponse,
} from "../../types/responses/PostDetailsResponse";

import styles from "./styles";
import { BottomSheetFooterCustom } from "./BottomSheetFooterCustom";

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
  // const [isShortDescription, setIsShortDescription] = useState(false);

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
        <BottomSheetFooterCustom vibeDetails={vibeDetails} props={props} />
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
              <Text>{formatTagsInText(vibeDetails?.message)}</Text>
            )}
          </ScrollView>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};
