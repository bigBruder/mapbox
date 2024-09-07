import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import Mapbox from "@rnmapbox/maps";

import { getDeviceUniqueId } from "@/providers/DeviceUniqueId";
import { useUserStore } from "@/store/userStore";

import { Login } from "@/components/login/Login";
import { VerifyScreen } from "@/components/login/verify/Verify";
import { Map } from "@/components/Map/Map";
import { PulseInfo } from "@/components/pulseInfo/PulseInfo";
import { Settings } from "@/components/settings/Settings";
import { DeleteAccount } from "@/components/deleteAccount/DeleteAccount";
import { DefaultHeader } from "@/components/defaultHeader/DefaultHeader";
import { PulseInfoHeader } from "@/components/pulseInfo/PulseInfoHeader";
import { MyProfile } from "@/components/myProfile/MyProfile";
import { MyProfileHeader } from "@/components/myProfile/MyProfileHeader";
import { LoginHeader } from "@/components/login/LoginHeader";
import * as Notifications from "expo-notifications";
import { useConfigStore } from "@/store/ServerConfigStore";
import { cleanUpExpiredNotifications } from "@/services/scheduleNotification";
import { getAuthData } from "@/services";
import { verifyUserWithToken } from "@/api/client";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_API_KEY || null);

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

const loginNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          header: () => <LoginHeader />,
        }}
      />
      <Stack.Screen
        name="Verify"
        component={VerifyScreen}
        options={{
          header: ({ navigation }) => (
            <DefaultHeader title={""} navigation={navigation} />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

const appNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Map}
        options={{ headerShown: false, header: () => null }}
      />
      <Stack.Screen
        name="Pulse"
        component={PulseInfo}
        options={{
          header: () => <PulseInfoHeader />,
        }}
      />
      <Stack.Screen
        name="MyProfile"
        component={MyProfile}
        options={{
          header: ({ navigation }) => (
            <MyProfileHeader navigation={navigation} />
          ),
        }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          header: ({ navigation }) => (
            <DefaultHeader title={"Settings"} navigation={navigation} />
          ),
        }}
      />
      <Stack.Screen
        name="DeleteAccount"
        component={DeleteAccount}
        options={{
          header: ({ navigation }) => (
            <DefaultHeader title={"Delete Account"} navigation={navigation} />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  const { user, setUser } = useUserStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));
  const { updateConfig } = useConfigStore((state) => state);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("You need to enable notifications to use this app");
      }
    };

    requestPermissions(); //
    updateConfig(); // fetch server config(vote interval, etc)
    // cleanUpExpiredNotifications(); // clean up expired notifications
  }, []);

  useEffect(() => {
    const getUser = async () => {
      console.log("App starting");
      try {
        const authData = await getAuthData();
        console.log("authData in appstarting", authData);
        if (authData) {
          console.log("authData in appstarting", authData);
          const token = authData.idToken;
          console.log("token in appstarting", token);
          const user = await verifyUserWithToken(token);
          console.log("user in appstarting", user);
          if (user) {
            console.log("user in appstarting", user);
            setUser(user);
          } else {
            console.log("deleting in appstarting", user);
            await SecureStore.deleteItemAsync("authData");
          }
        }
      } catch (error) {
        console.error("Error getting user in app starting", error);
      }
    };

    getUser();
  }, []);

  const [loaded, error] = useFonts({
    "SF-Text": require("./assets/fonts/SF-Pro-Text-Regular.ttf"),
    "SF-Text-Bold": require("./assets/fonts/SFProDisplay-Bold.ttf"),
    "SF-Text-SemiBold": require("./assets/fonts/SFProText-Semibold.ttf"),
    "SF-Text-Medium": require("./assets/fonts/SFProText-Medium.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        {!user ? loginNavigator() : appNavigator()}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({});
