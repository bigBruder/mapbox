import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  Touchable,
  TouchableOpacity,
} from "react-native";

import styles from "./styles";
import { Button } from "../UI/Button";
import GoogleIcon from "@/assets/icons/google";
import AppleIcon from "@/assets/icons/apple";
import ManIcon from "@/assets/icons/man";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/userStore";
import { useNavigation } from "@react-navigation/native";

export const Login = () => {
  const { toggleUser } = useUserStore((state) => state);
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "100%",
          }}
        >
          <Text style={[styles.title, { alignSelf: "center" }]}>Login</Text>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={"Non set"}
              placeholder="useless placeholder"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.buttonsContainer}>
            <Button
              title="Continue"
              onPress={() => {
                navigation.navigate("Verify");
              }}
            />
            <Button style={styles.loginWithProviderButton} onPress={() => {}}>
              <GoogleIcon />
              <Text> Continue with Google </Text>
            </Button>
            <Button style={styles.loginWithProviderButton} onPress={() => {}}>
              <AppleIcon />
              <Text> Continue with Apple </Text>
            </Button>
          </View>
        </View>
        <TouchableOpacity
          style={{
            margin: 10,
            backgroundColor: colors.pulsePrimary,
            padding: 10,
            borderRadius: 30,
          }}
          onPress={() => {
            toggleUser();
          }}
        >
          <ManIcon fill="white" />
        </TouchableOpacity>
        <View style={styles.signUpContainer}>
          <Text>Don't have an account?</Text>
          <TouchableOpacity>
            <Text style={styles.actionText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};
