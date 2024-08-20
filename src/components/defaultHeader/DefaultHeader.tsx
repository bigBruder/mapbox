import BackIcon from "@/assets/icons/back";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";

import styles from "./styles";

export const DefaultHeader = ({ navigation, title }) => {
  return (
    <SafeAreaView style={styles.headerContainer}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignContent: "center",
          padding: 20,
          gap: 10,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
            lineHeight: 24,
          }}
        >
          {title}
        </Text>
      </View>
    </SafeAreaView>
  );
};
