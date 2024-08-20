import { View, Image, Text, ImageBackground } from "react-native";
import styles from "./styles";
import PulseIcon from "@/assets/icons/pulse";
import { colors } from "@/constants/colors";
import PeopleIcon from "@/assets/icons/people";
import HeatmapIcon from "@/assets/icons/heatmap";
import TimerIcon from "@/assets/icons/timer";

export const PulseInfoTop = () => {
  return (
    <View style={styles.topContainer}>
      <View style={styles.imageContainer}>
        <ImageBackground
          source={require("@/assets/icons/polygon.png")}
          style={{
            padding: 20,
            alignItems: "center",
          }}
        >
          <Image
            source={require("@/assets/icons/mockIcon.png")}
            style={{
              height: 76,
              width: 76,
            }}
          />
        </ImageBackground>
      </View>
      <View style={styles.metricsContainer}>
        <PulseMetric
          title="Friends"
          icon={<PeopleIcon fill={colors.pulseGrey} width={24} height={20} />}
          value={"10M"}
        />
        <PulseMetric
          title="LifeTime"
          icon={<PulseIcon fill={colors.pulseGrey} width={24} height={20} />}
          value={"20000"}
        />
        <PulseMetric
          title="24 hour"
          icon={<TimerIcon width={24} height={20} />}
          value={"300"}
        />
      </View>
    </View>
  );
};

const PulseMetric = ({
  title,
  icon,
  value,
}: {
  title: string;
  icon: React.ReactNode;
  value: string;
}) => {
  return (
    <View style={styles.metricContainer}>
      <Text style={styles.metricText}>{title}</Text>
      {icon}
      <Text style={[styles.metricText, styles.metricTextRich]}>{value}</Text>
    </View>
  );
};
