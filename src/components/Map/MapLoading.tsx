import { View, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import styles from "./styles";

export const MapLoading = () => {
  return (
    <View style={styles.page}>
      <Image
        source={require("../../assets/loading_screen_map.png")}
        style={styles.absoluteFillObject}
        resizeMode="cover"
      />
      <StatusBar translucent backgroundColor="transparent" style="light" />
    </View>
  );
};
