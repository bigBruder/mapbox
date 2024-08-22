import { FC } from "react";
import { SafeAreaView, TouchableOpacity, View, Text } from "react-native";

import { Navigation } from "@/types/Navigation";
import BackIcon from "@/assets/icons/back";
import SettingsIcon from "@/assets/icons/settings";

import styles from "./styles";

export const MyProfileHeader: FC<Navigation> = ({ navigation }) => {
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
        <View style={styles.headerLeftContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackIcon />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              lineHeight: 24,
              fontFamily: "SF-Text-Bold",
            }}
          >
            My Profile
          </Text>
        </View>
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
