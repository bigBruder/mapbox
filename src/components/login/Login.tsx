import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import styles from "./styles";
import { Button } from "../UI/Button";
import GoogleIcon from "@/assets/icons/google";
import AppleIcon from "@/assets/icons/apple";
import ManIcon from "@/assets/icons/man";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/userStore";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { NavigationProp } from "@/types/Navigation";
import {
  loginUserWithEmailAndPassword,
  registerUserWithEmailAndPassword,
  verifyUserWithToken,
} from "@/api/client";
import { setAuthData } from "@/services";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{
    email?: string;
    password?: string;
    userName?: string;
  }>({
    email: "",
    password: "",
    userName: "",
  });

  const navigation = useNavigation<NavigationProp>();

  const { setUser } = useUserStore((state) => ({
    setUser: state.setUser,
  }));

  const isContinueDisabled = !email || !password;

  const validateForm = () => {
    let errors = {
      email: "",
      password: "",
      userName: "",
    };

    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email format is invalid";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password should be at least 6 characters";
    }

    if (!isLogin && !userName) {
      errors.userName = "Username is required";
    }

    return errors;
  };

  const handleContinuePress = useCallback(async () => {
    setIsLoading(true);

    const validationErrors = validateForm();
    if (
      validationErrors.email ||
      validationErrors.password ||
      validationErrors.userName
    ) {
      setError(validationErrors);
      setIsLoading(false);
      return;
    }
    try {
      if (!isLogin) {
        const newUser = await registerUserWithEmailAndPassword(
          email,
          password,
          userName
        );
        if (newUser) {
          const authData = await loginUserWithEmailAndPassword(email, password);
          if (authData) {
            setAuthData(authData);
            if (newUser) {
              setUser({
                ...newUser,
                email: email,
              });
              // navigation.navigate("Home");
            }
          }
        }
      } else {
        const authData = await loginUserWithEmailAndPassword(email, password);
        console.log("authData in login", authData);
        if (authData) {
          setAuthData(authData);
          const user = await verifyUserWithToken(authData.idToken);
          console.log("user in login", user);
          if (user) {
            setUser({
              ...user,
              email: email,
            });
            // navigation.navigate("Home");
          }
        }
      }
    } catch (error) {
      console.error("Error logging in:", error);
    } finally {
      setIsLoading(false);
    }
  }, [email, password, userName, isLogin, setUser, navigation]);
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
            gap: 10,
          }}
        >
          <Text style={[styles.title, { alignSelf: "center" }]}>
            {isLogin ? "Log in" : "Sign up"}
          </Text>
          {!isLogin && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>User name</Text>
              <TextInput
                style={styles.input}
                value={userName}
                placeholder="username"
                keyboardType="default"
                onChange={(e) => setUserName(e.nativeEvent.text)}
              />
              {error.userName && (
                <Text style={styles.errorText}>{error.userName}</Text>
              )}
            </View>
          )}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              placeholder="pulse@gmail.com"
              keyboardType="email-address"
              textContentType="emailAddress"
              onChange={(e) => {
                if (error.email) {
                  setError({ ...error, email: "" });
                }
                setEmail(e.nativeEvent.text);
              }}
            />
            {error.email && <Text style={styles.errorText}>{error.email}</Text>}
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              placeholder="****"
              textContentType="password"
              secureTextEntry={!isPasswordVisible}
              keyboardType="default"
              onChange={(e) => {
                if (error.password) {
                  setError({ ...error, password: "" });
                }
                setPassword(e.nativeEvent.text);
              }}
            />
            {error.password && (
              <Text style={styles.errorText}>{error.password}</Text>
            )}
          </View>
          <View style={styles.buttonsContainer}>
            <Button
              title="Continue"
              onPress={handleContinuePress}
              disabled={isContinueDisabled}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : null}
            </Button>
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
        <View
          style={{
            margin: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setUser({
                id: "-1",
                name: "Anonymous",
                picture: "",
                createdAt: "",
                lastVotedAt: "",
                totalVotes: 0,
              });
            }}
          >
            <Text style={[styles.actionText, { color: colors.pulseGrey }]}>
              Continue as guest
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.signUpContainer}>
          <Text>Don't have an account?</Text>
          <TouchableOpacity
            onPress={() => {
              setIsLogin(!isLogin);
            }}
          >
            <Text style={styles.actionText}>
              {isLogin ? "Sign up" : "Log in"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};
