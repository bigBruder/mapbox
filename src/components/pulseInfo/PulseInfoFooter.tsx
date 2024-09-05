import { TouchableOpacity, View, Text } from "react-native";

import { scheduleNotification } from "@/services/scheduleNotification";

import styles from "./styles";
import { Button } from "../UI/Button";
import ContentLoader, { Rect } from "react-content-loader/native";

const ONE_DAY_IN_SECONDS = 86400;

interface PulseInfoFooterProps {
  handleVote: () => void;
  disabled?: boolean;
  title: string;
  loading?: boolean;
}

export const PulseInfoFooter: React.FC<PulseInfoFooterProps> = ({
  handleVote,
  disabled = false,
  title,
  loading,
}) => {
  return (
    <View style={styles.footerContainer}>
      <Button
        title={title}
        onPress={handleVote}
        disabled={disabled || loading}
      />
    </View>
  );
};
