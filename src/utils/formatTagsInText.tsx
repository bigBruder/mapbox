import { Text } from "react-native";
import { colors } from "../constants/colors";

export const formatTagsInText = (text: string) => {
  return (
    <Text>
      {text.split(/(#\S+)/).map((part, index) => {
        if (part.startsWith("#")) {
          return (
            <Text key={index} style={{ color: colors.primary }}>
              {part}
            </Text>
          );
        } else {
          return part;
        }
      })}
    </Text>
  );
};
