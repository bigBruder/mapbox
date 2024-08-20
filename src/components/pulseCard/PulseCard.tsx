import { Image, View, Text, TouchableOpacity } from "react-native";

import styles from "./styles";
import ManIcon from "@/assets/icons/man";
import { ReactNode } from "react";
import PulseIcon from "@/assets/icons/pulse";
import { colors } from "@/constants/colors";
import { useNavigation } from "@react-navigation/native";

export const PulseCard = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigation.navigate("Pulse");
      }}
    >
      <View style={styles.imageContainer}>
        <Image
          source={require("@/assets/icons/mockIcon.png")}
          style={styles.image}
        />
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.title}>Fly Eagles Fly</Text>
        <InfoRow
          icon={<ManIcon width={14} height={14} />}
          value="Fly Eagles Fly"
        />
        <InfoRow
          icon={<PulseIcon fill={colors.pulseGrey} width={14} height={12} />}
          value="Philadelphia Eagles"
        />
      </View>
      <Text
        style={{
          marginTop: "auto",
          marginBottom: 10,
          marginRight: 4,
          fontSize: 12,
          fontWeight: "600",
          color: colors.pulseGrey,
        }}
      >
        58%
      </Text>
    </TouchableOpacity>
  );
};

const InfoRow = ({ icon, value }: { icon: ReactNode; value: string }) => {
  return (
    <View style={styles.infoRowContainer}>
      {icon}
      <Text style={styles.infoRowValue}>{value}</Text>
    </View>
  );
};
