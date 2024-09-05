import { TextInput, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ProfileIcon from "@/assets/icons/profile";
import { colors } from "@/constants/colors";

import { NavigationProp } from "@/types/Navigation";

import { ShareIcon, SearchIcon } from "@/assets/icons";

import styles from "./styles";

export const MapTopContainer = () => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <View style={styles.topContainer}>
      <View style={styles.upperContainer}>
        <TouchableOpacity
          style={[styles.searchButton, styles.topContainerShadow]}
          onPress={() => {
            navigation.navigate("MyProfile");
          }}
        >
          <ProfileIcon />
        </TouchableOpacity>
        <View style={[styles.searchContainer, styles.topContainerShadow]}>
          <SearchIcon />
          <TextInput
            placeholder="Search"
            style={styles.search}
            placeholderTextColor={colors.pulseGrey}
          />
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <ShareIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
};
