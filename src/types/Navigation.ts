import { ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export interface Navigation {
  navigation: NativeStackNavigationProp<ParamListBase, string, undefined>;
}

export interface RootStackParamList {
  Pulse: {
    state: {
      itemId: number;
    };
  };
  MyProfile: undefined;
  [key: string]: undefined | { state: { itemId: number } };
}

export type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  keyof RootStackParamList
>;
