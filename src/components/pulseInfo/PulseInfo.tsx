import { View } from "react-native";

import { PulseInfoFooter } from "./PulseInfoFooter";
import { PulseInfoTop } from "./PulseInfoTop";
import { PulseInfoContent } from "./PulseInfoContent";

import styles from "./styles";

export const PulseInfo = () => {
  return (
    <View
      style={{
        flex: 1,
        gap: 20,
        justifyContent: "space-between",
        backgroundColor: "white",
      }}
    >
      <PulseInfoTop />
      <PulseInfoContent />
      <PulseInfoFooter />
    </View>
  );
};
