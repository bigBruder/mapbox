import { View, Text, TouchableOpacity } from "react-native";

import { SettingsRow } from "./SettingsRow";
import { Navigation } from "@/types/Navigation";
import BackIcon from "@/assets/icons/back_rotated";
import ManIcon from "@/assets/icons/man";

import styles from "./styles";
import { useUserStore } from "@/store/userStore";

export const Settings: React.FC<Navigation> = ({ navigation }) => {
  const { user } = useUserStore((state) => ({
    user: state.user,
  }));

  return (
    <View style={styles.container}>
      {renderAccountRow(user.name)}
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Personal Info</Text>
        <View style={styles.settingsList}>
          <SettingsRow title="Email" value={user.email} onPress={() => {}} />
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

const renderAccountRow = (field: string) => (
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
          lineHeight: 24,
          fontFamily: "SF-Text-Bold",
        }}
      >
        {field}
      </Text>
    </View>
    <BackIcon />
  </TouchableOpacity>
);
