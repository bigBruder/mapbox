import { View, ActivityIndicator } from "react-native";

import styles from "./styles";
import { Button } from "../UI/Button";

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
      {loading ? (
        <Button
          title={title}
          onPress={handleVote}
          disabled={disabled || loading}
        >
          <ActivityIndicator
            size="small"
            color="white"
            style={{ marginLeft: 10 }}
          />
        </Button>
      ) : (
        <Button
          title={title}
          onPress={handleVote}
          disabled={disabled || loading}
        />
      )}
    </View>
  );
};
