import { TouchableOpacity, View, Text } from "react-native";

import styles from "./styles";

export const PulseInfoFooter = () => {
  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity style={styles.footerButton}>
        <Text style={styles.footerButtonText}>Pulse</Text>
      </TouchableOpacity>
    </View>
  );
};
