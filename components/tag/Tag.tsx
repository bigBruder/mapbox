import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

interface TagProps {
  tag: string;
  isActive: boolean;
}

export const Tag: FC<TagProps> = ({ tag, isActive = false }) => {
  return (
    <View style={[styles.tagContainer, isActive && styles.active]}>
      <Text style={[styles.tagText, isActive && styles.activeText]}>{tag}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tagContainer: {
    display: "flex",
    flexDirection: "row",
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D9DBEB",
    borderStyle: "solid",
    opacity: 0.8,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 10,
    paddingRight: 10,
  },
  tagText: {
    fontSize: 16,
    lineHeight: 20,
    color: "black",
    fontWeight: "400",
  },
  active: {
    backgroundColor: "#005DF2",
    color: "white",
    // borderColor: "#FFD700",
    opacity: 1,
  },
  activeText: {
    color: "white",
  },
});
