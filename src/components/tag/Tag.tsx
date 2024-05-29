import { FC } from "react";
import { Text, View } from "react-native";

import styles from "./styles";

interface TagProps {
  tag: string;
  isActive?: boolean;
}

export const Tag: FC<TagProps> = ({ tag, isActive = false }) => {
  return (
    <View style={[styles.tagContainer, isActive && styles.active]}>
      <Text style={[styles.tagText, isActive && styles.activeText]}>{tag}</Text>
    </View>
  );
};
