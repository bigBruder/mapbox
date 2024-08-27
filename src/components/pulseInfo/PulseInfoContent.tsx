import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableHighlight,
} from "react-native";

import ManIcon from "@/assets/icons/man";
import { scheduleNotification } from "@/services/scheduleNotification";

import styles from "./styles";

export const PulseInfoContent = () => {
  return (
    <ScrollView>
      <View style={styles.contentContainer}>
        <Text style={styles.pulseTitle}>Ram House</Text>
        <View style={styles.authorContainer}>
          <ManIcon />
          <Text style={styles.authorName}>Los Angeles Rams</Text>
        </View>
        <TouchableHighlight
          onPress={() => scheduleNotification({ seconds: 5 }, "1")}
        >
          <Text>Set Reminder in 5 seconds</Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => scheduleNotification({ seconds: 30 }, "1")}
        >
          <Text>Set Reminder in 30 seconds</Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => scheduleNotification({ seconds: 86400 }, "1")}
        >
          <Text>Set Reminder in 1 day</Text>
        </TouchableHighlight>
        <Text style={styles.contentText}>
          In the "Ram House," unity and explosive energy reign. This pulse aims
          to bring fans together under the banner of speed and strategy, the
          hallmarks of the Los Angeles Rams, encouraging them to be active
          participants in creating a thunderous home advantage.
        </Text>
        <Image source={require("@/assets/icons/mockImage.png")} />
      </View>
    </ScrollView>
  );
};
