import { TouchableOpacity, Text } from "react-native";

import styles from "./styles";
import { FC } from "react";

interface ButtonProps {
  title?: string;
  onPress: () => void;
  style?: any;
  styleText?: any;
  children?: any;
}

export const Button: FC<ButtonProps> = ({
  title,
  onPress,
  style,
  styleText,
  children,
}) => {
  return (
    <TouchableOpacity style={[styles.actionButton, style]} onPress={onPress}>
      {children ? (
        children
      ) : (
        <Text style={[styles.actionButtonText, styleText]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
