import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";

import styles from "./styles";

export const DeleteAccount = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Confirm deletion</Text>
        <Text style={styles.description}>
          In order to make sure that it is you, we will send you an email with a
          code to delete your account.
        </Text>
        <Text style={styles.description}>
          You will lose all your reviews, contacts and profile information.
          After entering the code, there is no turning back.
        </Text>
      </View>
      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Send code</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
