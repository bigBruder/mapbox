import React, { FC, useRef, useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

import { PorstDetailsValue } from "@/types/responses/PostDetailsResponse";

import { colors } from "@/constants/colors";

import { PulseCard } from "../pulseCard/PulseCard";
import { ScrollView } from "react-native-gesture-handler";
import { VibesItem } from "@/types/responses/SearchResponse";

import styles from "./styles";

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
            <Text style={styles.title}>Trending in this Cell</Text>
            <Text style={styles.subtitle}>Trending last 24 hours</Text>
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
