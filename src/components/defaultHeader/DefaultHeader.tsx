import BackIcon from "@/assets/icons/back";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";

import styles from "./styles";
import { Navigation } from "@/types/Navigation";

interface DefaultHeaderProps extends Navigation {
  title: string;
}

export const DefaultHeader: React.FC<DefaultHeaderProps> = ({
  navigation,
  title,
}) => {
  return (
    <SafeAreaView style={styles.headerContainer}>
      <View style={styles.leftContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
    </SafeAreaView>
  );
};
