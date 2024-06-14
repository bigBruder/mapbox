import { FC } from "react";
import { View, Text } from "react-native";

import { PorstDetailsValue } from "@/types/responses/PostDetailsResponse";
import { BottomSheetFooter } from "@gorhom/bottom-sheet";
import { LikeIcon, MoreIcon, ShareIcon } from "@/assets/icons";

import styles from "./styles";

interface Props {
  vibeDetails: PorstDetailsValue | null;
  props: any;
}

export const BottomSheetFooterCustom: FC<Props> = ({ vibeDetails, props }) => (
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

    <View style={styles.actionContainer}>
      <MoreIcon />
      <Text>More</Text>
    </View>
  </BottomSheetFooter>
);
