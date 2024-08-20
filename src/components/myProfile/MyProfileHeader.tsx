import BackIcon from "@/assets/icons/back";
import { SafeAreaView, TouchableOpacity, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

import styles from "./styles";
import SettingsIcon from "@/assets/icons/settings";

export const MyProfileHeader = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.headerContainer}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
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
          My Profile
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Settings");
          }}
        >
          <SettingsIcon />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
