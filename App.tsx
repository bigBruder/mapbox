import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import Mapbox from "@rnmapbox/maps";

import { getAccessToken } from "@/api/client";
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
          header: ({ navigation }) => (
            <PulseInfoHeader navigation={navigation} />
          ),
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
  const { user } = useUserStore((state) => state);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("You need to enable notifications to use this app");
      }
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const access_token = await SecureStore.getItemAsync(
          "mapbox_secure_access_token"
        );
        getDeviceUniqueId().then(async () => {
          getAccessToken();
        });
      } catch (error) {
        console.error(error);
      }
    })();
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
