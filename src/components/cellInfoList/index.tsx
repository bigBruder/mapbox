import { View } from "react-native";
import { PulseCard } from "../pulseCard/PulseCard";
import { Topic } from "@/types/responses/cellInfoResponse";

import styles from "./styles";

interface Props {
  topics: Topic[];
}

export const CellInfoList: React.FC<Props> = ({ topics }) => {
  if (!topics || topics.length === 0) return null;
  return (
    <View style={styles.container}>
      {topics.map((topic) => (
        <PulseCard topic={topic} key={topic.id} />
      ))}
    </View>
  );
};
