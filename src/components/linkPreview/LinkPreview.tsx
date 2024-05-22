import React, { FC, useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { getWebPageMeta } from "../../api/client";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { Linking } from "react-native";

interface Props {
  message: string;
}

export const LinkPreview: FC<Props> = ({ message }) => {
  if (!message.includes("https://")) {
    return null;
  }

  useEffect(() => {
    if (!message.includes("https://")) {
      return;
    }
    (async () => {
      try {
        const url = message.slice(
          message.indexOf("https://"),
          message.indexOf(" ", message.indexOf("https://"))
        );
        // setUrl(url);
        const meta = await getWebPageMeta(
          // "https://www.instagram.com/reel/C7O4bPytH09/?utm_source=ig_web_copy_link"
          url
        );
        if (!meta) return;
        setMetaData(meta);
      } catch (error) {
        console.error("Error fetching metadata:", error);
      }
    })();
  }, [message]);

  const [metaData, setMetaData] = useState<Record<string, string> | null>(null);
  const url = message.slice(
    message.indexOf("https://"),
    message.indexOf(" ", message.indexOf("https://"))
  );

  const handlePress = () => {
    if (!url) return;
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't load page", err)
    );
  };

  // return null if message does not contain a link

  const editedMessage = url ? message.replace(url, "") : message;

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      {metaData && <Text style={styles.title}>{metaData["og:title"]}</Text>}
      <Text>{editedMessage}</Text>
      {metaData && metaData["og:image"] && (
        <Image source={{ uri: metaData["og:image"] }} style={styles.image} />
      )}
      <Text style={styles.link}>{url}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    backgroundColor: "rgba(5, 89, 227, 0.05)",
  },
  title: {
    fontWeight: "bold",
  },
  image: {
    height: 150,
    objectFit: "cover",
  },
  link: {
    color: "#005DF2",
  },
});
