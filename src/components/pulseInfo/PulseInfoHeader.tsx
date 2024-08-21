import BackIcon from "@/assets/icons/back";
import { SafeAreaView, TouchableOpacity, View } from "react-native";

import styles from "./styles";
import PulseIcon from "@/assets/icons/pulse";
import { MoreIcon, ShareIcon } from "@/assets/icons";
import HeatmapIcon from "@/assets/icons/heatmap";
import { colors } from "@/constants/colors";

export const PulseInfoHeader = ({ navigation }) => {
  return (
    <View style={styles.headerContainer}>
      <SafeAreaView style={styles.headerContentContainer}>
        <View
          style={{
            width: "55%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              alignContent: "center",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <BackIcon />
          </TouchableOpacity>
          <View
            style={{
              alignSelf: "center",
            }}
          >
            <PulseIcon width={35} height={32} fill={colors.pulsePrimary} />
          </View>
        </View>
        <View style={styles.headerNavigationContainer}>
          <TouchableOpacity>
            <MoreIcon fill={colors.pulseGrey} />
          </TouchableOpacity>
          <TouchableOpacity>
            <HeatmapIcon />
          </TouchableOpacity>
          <TouchableOpacity>
            <ShareIcon fill={colors.pulseGrey} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};
