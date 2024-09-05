import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableHighlight,
} from "react-native";

import ManIcon from "@/assets/icons/man";
import { scheduleNotification } from "@/services/scheduleNotification";

import styles from "./styles";
import { Topic } from "@/types/responses/cellInfoResponse";
import { Facebook } from "react-content-loader/native";

interface Props {
  topic: Topic | null;
  loading: boolean;
}

export const PulseInfoContent: React.FC<Props> = ({ topic, loading }) => {
  if (!topic) return null;
  if (loading) return <LoadingComponentContent />;
  return (
    <ScrollView>
      <View style={styles.contentContainer}>
        <Text style={styles.pulseTitle}>{topic.title}</Text>
        <View style={styles.authorContainer}>
          <ManIcon />
          <Text style={styles.authorName}>{topic.author.name}</Text>
        </View>
        <TouchableHighlight
          onPress={() => scheduleNotification({ seconds: 5 }, topic.id + "")}
        >
          <Text>Set Reminder in 5 seconds</Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => scheduleNotification({ seconds: 30 }, topic.id + "")}
        >
          <Text>Set Reminder in 30 seconds</Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() =>
            scheduleNotification({ seconds: 86400 }, topic.id + "")
          }
        >
          <Text>Set Reminder in 1 day</Text>
        </TouchableHighlight>
        <Text style={styles.contentText}>{topic.description}</Text>
        <Image
          source={require("@/assets/icons/mockImage.png")}
          style={styles.image}
        />
      </View>
    </ScrollView>
  );
};

const LoadingComponentContent = () => {
  return (
    <View style={styles.contentContainer}>
      <Facebook width={350} />
    </View>
  );
};
