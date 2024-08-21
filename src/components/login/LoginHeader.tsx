import { Image, SafeAreaView, View } from "react-native";

import styles from "./styles";

export const LoginHeader = () => {
  return (
    <View style={styles.header}>
      <SafeAreaView>
        <Image source={require("@/assets/logo.png")} style={styles.logo} />
      </SafeAreaView>
    </View>
  );
};
