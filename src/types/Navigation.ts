import { ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export interface Navigation {
  navigation: NativeStackNavigationProp<ParamListBase, string, undefined>;
}

export interface RootStackParamList {
  Pulse: {
    state: {
      itemId: string;
    };
  };
}
