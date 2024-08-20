import React, { FC } from "react";
import { TouchableOpacity, View, Text } from "react-native";

import BackIcon from "@/assets/icons/back_rotated";

import styles from "./styles";

interface SettingsRowProps {
  title: string;
  value?: string;
  isActionsCategory?: boolean;
  onPress: () => void;
}

export const SettingsRow: FC<SettingsRowProps> = ({
  title,
  value,
  isActionsCategory,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.rowContainer} onPress={onPress}>
      <View style={styles.leftContainer}>
        <Text style={[styles.title, isActionsCategory && styles.titleAction]}>
          {title}
        </Text>
        {value && (
          <Text style={[styles.value, isActionsCategory && styles.valueAction]}>
            {value}
          </Text>
        )}
      </View>
      <BackIcon />
    </TouchableOpacity>
  );
};
