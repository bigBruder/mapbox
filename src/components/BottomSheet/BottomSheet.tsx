import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { Image, SafeAreaView, Text, View } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

import { getVibeDetails } from "@/api/client";
import { formatDateForVibe, formatTagsInText } from "@/utils";
import { getIconUrl } from "@/utils/getIconUrl";
import { VibesItem } from "@/types/SearchResponse";
import {
  PorstDetailsValue,
  PostDetailsResponse,
} from "@/types/responses/PostDetailsResponse";
import { Facebook } from "react-content-loader/native";

import { BottomSheetFooterCustom } from "./BottomSheetFooterCustom";
import { LinkPreview } from "@/components/linkPreview/LinkPreview";
import { removeLinkFromString } from "@/helpers/removeLinkFromString";
import { colors } from "@/constants/colors";

import styles from "./styles";

interface Props {
  selectedMarker: VibesItem;
  setSelectedMarker: (v: VibesItem | null) => void;
}

export const ModalDataMarker: FC<Props> = ({
  selectedMarker,
  setSelectedMarker,
}) => {
  const snapPoints = ["45%", "93%"];
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [vibeDetails, setVibeDetails] = useState<PorstDetailsValue | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isIconLoading, setisIconLoading] = useState(true);

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

  const isAlreadyStarted = useMemo(() => {
    return new Date(selectedMarker?.startsAt) < new Date();
  }, [selectedMarker?.id]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
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
      handleComponent={() => {
        return <View style={styles.bottomSheetHandle} />;
      }}
      style={styles.bottomSheet}
    >
      <BottomSheetView style={styles.bottomsheetView}>
        <SafeAreaView style={styles.safeBottomSheetContainer}>
          <View style={styles.topBox}>
            {isLoading && !isIconLoading ? (
              <Facebook />
            ) : (
              <>
                <View
                  style={[
                    styles.imageContainer,
                    {
                      borderColor: isAlreadyStarted
                        ? colors.primary
                        : colors.greyAccent,
                    },
                  ]}
                >
                  <Image
                    source={{
                      uri: getIconUrl(selectedMarker.icon.split(":")[1], true),
                    }}
                    onLoadStart={() => setisIconLoading(true)}
                    onLoadEnd={() => setisIconLoading(false)}
                    style={[styles.icon]}
                  />
                </View>
                <View style={styles.topRightContainer}>
                  <Text style={styles.userName}>
                    {vibeDetails?.author.userName}
                  </Text>
                  <Text style={styles.text}>{vibeDetails?.venue.name}</Text>
                </View>
              </>
            )}
          </View>
          {!isLoading && (
            <View
              style={[
                styles.dateContainer,
                !isAlreadyStarted && styles.dateContainerStarted,
              ]}
            >
              {vibeDetails?.startsAt && (
                <Text
                  style={[styles.date, !isAlreadyStarted && styles.dateStarted]}
                >
                  {formatDateForVibe(
                    vibeDetails?.startsAt,
                    vibeDetails?.expiresAt
                  )}
                </Text>
              )}
            </View>
          )}
          {!isLoading && (
            <View style={[styles.sheetContainer]}>
              <Text>Points: {vibeDetails?.points}</Text>
              {vibeDetails?.message && (
                <Text style={styles.message}>
                  {formatTagsInText(removeLinkFromString(vibeDetails?.message))}
                </Text>
              )}
              {vibeDetails?.message &&
                vibeDetails?.message.includes("https://") && (
                  <LinkPreview message={vibeDetails?.message} />
                )}
            </View>
          )}
        </SafeAreaView>
      </BottomSheetView>
    </BottomSheet>
  );
};
