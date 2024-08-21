import { useEffect } from "react";
import { StyleSheet, View, SafeAreaView, Image } from "react-native";
import Mapbox from "@rnmapbox/maps";
import { Map } from "@/components/Map/Map";
import { getAccessToken } from "@/api/client";
import { getDeviceUniqueId } from "@/providers/DeviceUniqueId";
import * as SecureStore from "expo-secure-store";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import BackIcon from "@/assets/icons/back_rotated";
import { PulseInfo } from "@/components/pulseInfo/PulseInfo";
import { PulseInfoHeader } from "@/components/pulseInfo/PulseInfoHeader";
import { MyProfile } from "@/components/myProfile/MyProfile";
import { MyProfileHeader } from "@/components/myProfile/MyProfileHeader";
import { Settings } from "@/components/settings/Settings";
import { DefaultHeader } from "@/components/defaultHeader/DefaultHeader";
import { DeleteAccount } from "@/components/deleteAccount/DeleteAccount";
import { Login } from "@/components/login/Login";
import { LoginHeader } from "@/components/login/LoginHeader";
import { useUserStore } from "@/store/userStore";
import { VerifyScreen } from "@/components/login/verify/Verify";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_API_KEY || null);

const Stack = createNativeStackNavigator();

export default function App() {
  const { user } = useUserStore((state) => state);
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        {!user ? (
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
        ) : (
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
                  <DefaultHeader
                    title={"Delete Account"}
                    navigation={navigation}
                  />
                ),
              }}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({});
