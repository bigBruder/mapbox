import { ReactNode } from "react";
import { Image, View, Text, TouchableOpacity } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import { RootStackParamList } from "@/types/Navigation";
import PulseIcon from "@/assets/icons/pulse";
import ManIcon from "@/assets/icons/man";
import { colors } from "@/constants/colors";

import styles from "./styles";
import { Topic } from "@/types/responses/cellInfoResponse";

type PulseCardNavigationProp = NavigationProp<RootStackParamList, "Pulse">;
const BASE_ICON_URL = "https://pulsedevdata.blob.core.windows.net";

interface PulseCardProps {
  topic: Topic;
}

export const PulseCard: React.FC<PulseCardProps> = ({ topic }) => {
  // console.log("topic", topic);
  const navigation = useNavigation<PulseCardNavigationProp>();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigation.navigate("Pulse", {
          state: {
            itemId: topic.id,
          },
        });
      }}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: BASE_ICON_URL + topic.icon,
          }}
          style={styles.image}
        />
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.title}>{topic.title}</Text>
        <InfoRow
          icon={<ManIcon width={14} height={14} />}
          value={topic.author.name}
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
