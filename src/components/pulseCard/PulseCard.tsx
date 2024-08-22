import { ReactNode } from "react";
import { Image, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import PulseIcon from "@/assets/icons/pulse";
import ManIcon from "@/assets/icons/man";
import { colors } from "@/constants/colors";

import styles from "./styles";

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
      <Text style={styles.percentageText}>58%</Text>
    </TouchableOpacity>
  );
};

type InfoRowProps = {
  icon: ReactNode;
  value: string;
};

const InfoRow: React.FC<InfoRowProps> = ({ icon, value }) => {
  return (
    <View style={styles.infoRowContainer}>
      {icon}
      <Text style={styles.infoRowValue}>{value}</Text>
    </View>
  );
};
