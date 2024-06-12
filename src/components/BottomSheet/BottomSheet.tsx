import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Image, SafeAreaView, Text, View } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

import { getVibeDetails } from "../../api/client";
import { formatDate } from "../../utils/formatDate";
import { formatTagsInText } from "../../utils/formatTagsInText";
import { getIconUrl } from "../../utils/getIconUrl";
import { VibesItem } from "../../types/searchResponse";
import {
  PorstDetailsValue,
  PostDetailsResponse,
} from "../../types/responses/PostDetailsResponse";
import { Facebook } from "react-content-loader/native";

import styles from "./styles";
import { BottomSheetFooterCustom } from "./BottomSheetFooterCustom";
import { LinkPreview } from "../linkPreview/LinkPreview";
import { removeLinkFromString } from "../../helpers/removeLinkFromString";
import { colors } from "../../constants/colors";

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
      animationConfigs={{
        animationEasing: "ease-in-out",
        initialIndex: 0,
        springConfig: { mass: 1, damping: 500, stiffness: 100 },
      }}
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
                  {formatDate(vibeDetails?.startsAt, vibeDetails?.expiresAt)}
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
