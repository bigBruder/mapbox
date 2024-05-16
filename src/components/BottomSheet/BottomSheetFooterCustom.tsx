import { View, Text } from "react-native";
import { LikeIcon, MoreIcon, ShareIcon } from "../../assets/icons";

import styles from "./styles";
import { PorstDetailsValue } from "../../types/responses/PostDetailsResponse";
import { FC } from "react";
import { BottomSheetFooter } from "@gorhom/bottom-sheet";

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
    <MoreIcon />
  </BottomSheetFooter>
);