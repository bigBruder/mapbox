import ManIcon from "@/assets/icons/man";
import { View, Text, TouchableOpacity } from "react-native";

import styles from "./styles";
import BackIcon from "@/assets/icons/back_rotated";
import { SettingsRow } from "./SettingsRow";

export const Settings = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {renderAccountRow()}
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Personal Info</Text>
        <View style={styles.settingsList}>
          <SettingsRow
            title="Email"
            value="naveen@gmail.com"
            onPress={() => {}}
          />
          <SettingsRow
            title="Phone"
            value="+1 123 456 2148"
            onPress={() => {}}
          />
        </View>
      </View>

      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Actions</Text>
        <View style={styles.settingsList}>
          <SettingsRow title="Log Out" onPress={() => {}} isActionsCategory />
          <SettingsRow
            title="Delete Account"
            value="If you delete your account now, you will have the option to recover it within 30 days"
            isActionsCategory
            onPress={() => {
              navigation.navigate("DeleteAccount");
            }}
          />
        </View>
      </View>
    </View>
  );
};

const renderAccountRow = () => (
  <TouchableOpacity style={[styles.rowContainer, styles.accountRowContainer]}>
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 13,
      }}
    >
      <ManIcon />
      <Text
        style={{
          fontSize: 20,
          fontWeight: "600",
          lineHeight: 24,
        }}
      >
        Chicago Bears
      </Text>
    </View>
    <BackIcon />
  </TouchableOpacity>
);
