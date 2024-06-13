import { FC } from "react";
import { View, Text } from "react-native";
import { EyeHiddenIcon, EyeIcon } from "@/assets/icons";
import styles from "./styles";
interface Props {
  total: number;
  visible: number;
}

export const TotalResults: FC<Props> = ({ total, visible }) => {
  return total > 0 ? (
    <View style={[styles.searchButton, styles.totalResults]}>
      <View style={styles.resultContainer}>
        <EyeHiddenIcon />
        <Text style={styles.resultText}>
          {total - visible >= 0 ? total - visible : "-"}
        </Text>
      </View>
      <View style={styles.line} />
      <View>
        <EyeIcon />
        <Text style={styles.resultText}>{visible}</Text>
      </View>
    </View>
  ) : (
    <View style={[styles.searchButton, styles.totalResults]}>
      <Text>No results</Text>
    </View>
  );
};
