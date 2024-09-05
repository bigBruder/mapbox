import { View, Text, ScrollView } from "react-native";

import styles from "./styles";

export const History = () => {
  return (
    <View style={styles.historyContainer}>
      <ScrollView
        style={{ overflow: "visible" }}
        scrollIndicatorInsets={{
          right: -10,
          top: 20,
        }}
      >
        <View style={styles.topContainer}>
          <Text style={styles.title}>History</Text>
          <Text style={styles.subTitle}>History Visible only for you</Text>
        </View>

        <View style={styles.historyList}>{/* <PulseCard /> */}</View>
      </ScrollView>
    </View>
  );
};
