import { View } from "react-native";

import { PulseInfoFooter } from "./PulseInfoFooter";
import { PulseInfoTop } from "./PulseInfoTop";
import { PulseInfoContent } from "./PulseInfoContent";

import { RouteProp, useRoute } from "@react-navigation/native";

import styles from "./styles";
import { RootStackParamList } from "@/types/Navigation";

export const PulseInfo = () => {
  const route =
    useRoute<RouteProp<Pick<RootStackParamList, "Pulse">, "Pulse">>();

  // const { state } = route.params; // state.itemId

  return (
    <View style={styles.pulseInfoContainer}>
      <PulseInfoTop />
      <PulseInfoContent />
      <PulseInfoFooter />
    </View>
  );
};
