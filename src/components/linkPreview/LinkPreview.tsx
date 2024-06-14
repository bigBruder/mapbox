import React, { FC, useEffect, useState } from "react";
import { Text, Image, TouchableOpacity, Linking } from "react-native";
import { getWebPageMeta } from "@/api/client";

import styles from "./styles";
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
        const meta = await getWebPageMeta(url);
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

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      {metaData && <Text style={styles.title}>{metaData["og:title"]}</Text>}
      {metaData && metaData["og:image"] && (
        <Image source={{ uri: metaData["og:image"] }} style={styles.image} />
      )}
      <Text style={styles.link}>{url}</Text>
    </TouchableOpacity>
  );
};
