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

import { LinkPreview } from "@/components/linkPreview/LinkPreview";
import { removeLinkFromString } from "@/helpers/removeLinkFromString";
import { colors } from "@/constants/colors";

import styles from "./styles";
import { PulseCard } from "../pulseCard/PulseCard";
import { ScrollView } from "react-native-gesture-handler";

interface Props {
  selectedPolygon: VibesItem;
  setSelectedPolygon: (v: VibesItem | null) => void;
}

export const CellInfo: FC<Props> = ({
  selectedPolygon,
  setSelectedPolygon,
}) => {
  const snapPoints = ["45%", "93%"];
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [vibeDetails, setVibeDetails] = useState<PorstDetailsValue | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isIconLoading, setisIconLoading] = useState(true);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onClose={() => {
        setSelectedPolygon(null);
      }}
      animateOnMount={true}
      bottomInset={0}
      footerComponent={(props) => null}
      handleComponent={() => {
        return <View style={styles.bottomSheetHandle} />;
      }}
      style={styles.bottomSheet}
    >
      <BottomSheetView style={styles.bottomsheetView}>
        <SafeAreaView style={styles.safeBottomSheetContainer}>
          <View
            style={{
              paddingBottom: 20,
              gap: 6,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              Trending in this Cell
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "400",
                color: "#8386A5",
              }}
            >
              Trending last 24 hours
            </Text>
          </View>
          <ScrollView>
            <View
              style={{
                flex: 1,
                height: "100%",
                gap: 15,
              }}
            >
              <PulseCard />
              <PulseCard />
              <PulseCard />
              <PulseCard />
              <PulseCard />
            </View>
          </ScrollView>
        </SafeAreaView>
      </BottomSheetView>
    </BottomSheet>
  );
};
