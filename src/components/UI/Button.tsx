import { TouchableOpacity, Text } from "react-native";

import styles from "./styles";
import { FC } from "react";

interface ButtonProps {
  title?: string;
  onPress: () => void;
  style?: any;
  styleText?: any;
  children?: any;
  disabled?: boolean;
}

export const Button: FC<ButtonProps> = ({
  title,
  onPress,
  style,
  styleText,
  children,
  disabled,
}) => {
  return (
    <TouchableOpacity
      style={[styles.actionButton, style, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      {children ? (
        children
      ) : (
        <Text style={[styles.actionButtonText, styleText]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
