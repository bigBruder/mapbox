import React, { FC, useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

import { ScrollView } from "react-native-gesture-handler";
import { VibesItem } from "@/types/responses/SearchResponse";

import { CellInfoList } from "../cellInfoList";
import { useHexagonsStore } from "@/store/hexagonsStore";
import { getCellInfo } from "@/api/client";

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

  const { selectedPolygonId, setSelectedPolygonId } = useHexagonsStore(
    (state) => ({
      selectedPolygonId: state.selectedPolygonId,
      setSelectedPolygonId: state.setSelectedPolygonId,
    })
  );

  const [cellInfo, setCellInfo] = useState<any>(null);

  useEffect(() => {
    if (!selectedPolygonId) return;

    const fetchCellInfo = async () => {
      const response = await getCellInfo(selectedPolygonId.toString());
      setCellInfo(response);
    };

    fetchCellInfo();
  }, [selectedPolygonId]);

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
        <View
          style={{
            gap: 6,
            padding: 20,
            paddingBottom: 0,
          }}
        >
          <Text style={styles.title}>Trending in this Cell</Text>
          <Text style={styles.subtitle}>Trending last 24 hours</Text>
        </View>
        <ScrollView
          style={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <CellInfoList topics={cellInfo} />
        </ScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
};
