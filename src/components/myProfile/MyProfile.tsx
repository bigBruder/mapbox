import { View, Text } from "react-native";
import { History } from "../history/History";

import styles from "./styles";

export const MyProfile = () => {
  return (
    <View style={styles.container}>
      <History />
    </View>
  );
};
