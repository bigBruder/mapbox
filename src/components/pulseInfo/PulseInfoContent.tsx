import { ScrollView, View, Text, Image } from "react-native";

import styles from "./styles";
import PeopleIcon from "@/assets/icons/people";
import ManIcon from "@/assets/icons/man";

export const PulseInfoContent = () => {
  return (
    <ScrollView>
      <View style={styles.contentContainer}>
        <Text style={styles.pulseTitle}>Ram House</Text>
        <View style={styles.authorContainer}>
          <ManIcon />
          <Text style={styles.authorName}>Los Angeles Rams</Text>
        </View>
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
