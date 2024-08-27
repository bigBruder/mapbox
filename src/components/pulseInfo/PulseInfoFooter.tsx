import { TouchableOpacity, View, Text } from "react-native";

import { scheduleNotification } from "@/services/scheduleNotification";

import styles from "./styles";

const ONE_DAY_IN_SECONDS = 86400;

export const PulseInfoFooter = () => {
  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity
        style={styles.footerButton}
        onPress={() =>
          scheduleNotification({ seconds: ONE_DAY_IN_SECONDS }, "1")
        }
      >
        <Text style={styles.footerButtonText}>Pulse</Text>
      </TouchableOpacity>
    </View>
  );
};
