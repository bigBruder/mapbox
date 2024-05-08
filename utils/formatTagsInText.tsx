import { Text } from "react-native";

export const formatTagsInText = (text: string) => {
  return (
    <Text>
      {text.split(/(#\w+)/).map((part, index) => {
        if (part.startsWith("#")) {
          return (
            <Text key={index} style={{ color: "#005DF2" }}>
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
