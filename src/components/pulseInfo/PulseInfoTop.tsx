import { View, Image, Text, ImageBackground } from "react-native";
import styles from "./styles";
import PulseIcon from "@/assets/icons/pulse";
import { colors } from "@/constants/colors";
import PeopleIcon from "@/assets/icons/people";
import TimerIcon from "@/assets/icons/timer";
import { Topic } from "@/types/responses/cellInfoResponse";
import ContentLoader, {
  Circle,
  Facebook,
  Rect,
} from "react-content-loader/native";
import { useConfigStore } from "@/store/ServerConfigStore";

interface Props {
  topic: Topic | null;
  loading: boolean;
}

export const PulseInfoTop: React.FC<Props> = ({ topic, loading }) => {
  if (!topic) return null;
  if (loading) return <LoadingComponentTop />;

  const { blobUrlPrefix: linkPrefix } = useConfigStore((state) => ({
    blobUrlPrefix: state.blobUrlPrefix,
  }));

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
            source={{ uri: linkPrefix + topic.icon }}
            style={styles.topIcon}
          />
        </ImageBackground>
      </View>
      <View style={styles.metricsContainer}>
        <PulseMetric
          title="Friends"
          icon={<PeopleIcon fill={colors.pulseGrey} width={24} height={20} />}
          value={topic?.stats.totalUniqueUsers + ""}
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

const LoadingComponentTop = () => (
  <View style={styles.topContainer}>
    <View style={styles.imageContainer}>
      <ImageBackground
        style={{
          padding: 20,
          alignItems: "center",
        }}
      >
        <ContentLoader speed={1} width={80} height={80} viewBox="0 0 100 100">
          <Circle cx="50" cy="50" r="50" />
        </ContentLoader>
      </ImageBackground>
    </View>
    <View style={styles.metricsContainer}>
      <ContentLoader
        speed={1}
        width={200}
        height={80}
        viewBox="0 0 100 50"
        backgroundColor={colors.lightGrey}
        foregroundColor={colors.white}
      >
        <Rect x="3" y="0" rx="3" ry="3" width="60" height="10" />
        <Rect x="3" y="20" rx="3" ry="3" width="60" height="10" />
        <Rect x="3" y="40" rx="3" ry="3" width="60" height="10" />
      </ContentLoader>
    </View>
  </View>
);
