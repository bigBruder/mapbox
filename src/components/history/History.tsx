import { View, Text } from "react-native";
import { PulseCard } from "../pulseCard/PulseCard";

import styles from "./styles";
import { ScrollView } from "react-native";

export const History = () => {
  return (
    <View style={styles.historyContainer}>
      <ScrollView style={{ overflow: "visible" }}>
        <View style={styles.topContainer}>
          <Text style={styles.title}>History</Text>
          <Text style={styles.subTitle}>History Visible only for you</Text>
        </View>

        <View style={styles.historyList}>
          <PulseCard />
          <PulseCard />
          <PulseCard />
          <PulseCard />
          <PulseCard />
        </View>
      </ScrollView>
    </View>
  );
};
