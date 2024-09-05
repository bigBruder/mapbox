import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";

import { Navigation } from "@/types/Navigation";
import BackIcon from "@/assets/icons/back";

import styles from "./styles";

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
