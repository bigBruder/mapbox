import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { Image, Text, View } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { ScrollView } from "react-native-gesture-handler";

import { getVibeDetails, getWebPageMeta } from "../../api/client";
import { formatDate } from "../../utils/formatDate";
import { formatTagsInText } from "../../utils/formatTagsInText";
import { getIconUrl } from "../../utils/getIconUrl";
import { VibesItem } from "../../types/searchResponse";
import {
  PorstDetailsValue,
  PostDetailsResponse,
} from "../../types/responses/PostDetailsResponse";
import ContentLoader, { Facebook } from "react-content-loader/native";

import styles from "./styles";
import { BottomSheetFooterCustom } from "./BottomSheetFooterCustom";
import axios from "axios";
import cheerio from "cheerio";
import { LinkPreview } from "../linkPreview/LinkPreview";
import { removeLinkFromString } from "../../helpers/removeLinkFromString";

interface Props {
  selectedMarker: VibesItem;
  setSelectedMarker: (v: VibesItem | null) => void;
}

export const ModalDataMarker: FC<Props> = ({
  selectedMarker,
  setSelectedMarker,
}) => {
  const snapPoints = ["35%", "60%", "80%"];
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleSheetChanges = useCallback(
    (index: number) => {},
    [selectedMarker]
  );

  const [vibeDetails, setVibeDetails] = useState<PorstDetailsValue | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedMarker.id) {
      bottomSheetRef.current?.snapToIndex(0);
    }
  }, [selectedMarker.id]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const details: PostDetailsResponse = await getVibeDetails(
          selectedMarker.id
        );
        setVibeDetails(details.value);
      } catch (error) {
        console.error("Error fetching vibe details:", error);
      } finally {
        setIsLoading(false);
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
      bottomInset={0}
      footerComponent={(props) => (
        <BottomSheetFooterCustom vibeDetails={vibeDetails} props={props} />
      )}
      style={styles.bottomSheet}
    >
      <BottomSheetView style={styles.bottomsheetView}>
        <View style={styles.topBox}>
          {isLoading ? (
            <Facebook />
          ) : (
            <>
              <Image
                source={{
                  uri: getIconUrl(selectedMarker.icon.split(":")[1], true),
                }}
                style={styles.icon}
              />
              <View style={styles.topRightContainer}>
                <Text>{vibeDetails?.author["userName"]}</Text>
                <Text>{vibeDetails?.venue.name}</Text>
              </View>
            </>
          )}
        </View>
        {!isLoading && (
          <View style={styles.dateContainer}>
            {vibeDetails?.startsAt && (
              <Text style={{ color: "#005DF2" }}>
                {formatDate(vibeDetails?.startsAt, vibeDetails?.expiresAt)}
              </Text>
            )}
          </View>
        )}
      </BottomSheetView>
      {!isLoading && (
        <View style={[styles.sheetContainer]}>
          <Text>Points: {vibeDetails?.points}</Text>
          <Text>Starts at: {vibeDetails?.startsAt}</Text>
          {vibeDetails?.message && (
            <Text>
              {formatTagsInText(removeLinkFromString(vibeDetails?.message))}
            </Text>
          )}
          {vibeDetails?.message &&
            vibeDetails?.message.includes("https://") && (
              <LinkPreview message={vibeDetails?.message} />
            )}
        </View>
      )}
    </BottomSheet>
  );
};
