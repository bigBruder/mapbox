import { FC, useEffect, useState } from "react";
import { Image, TouchableOpacity, StyleSheet } from "react-native";
import { MarkerView } from "@rnmapbox/maps";
import h3 from "h3-js";
import { TopicData, TopicsResponse } from "@/types/responses/MapTopicsResponse";
import { useHexagonsStore } from "@/store/hexagonsStore";

import styles from "./styles";
import { useConfigStore } from "@/store/ServerConfigStore";

interface Props {
  topics: TopicsResponse;
  zoomLevel: number;
}

export const MarkerList: FC<Props> = ({ topics, zoomLevel }) => {
  if (!topics) return;

  const [transformedTopics, setTransformedTopics] = useState<any>([]);
  const { setSelectedPolygon, setSelectedPolygonId } = useHexagonsStore(
    (state) => ({
      setSelectedPolygon: state.setSelectedPolygon,
      setSelectedPolygonId: state.setSelectedPolygonId,
    })
  );
  const { blobUrlPrefix: linkPrefix } = useConfigStore((state) => ({
    blobUrlPrefix: state.blobUrlPrefix,
  }));

  const interpolatePinSize = (currentZoom: number) => {
    const minZoom = 0;
    const maxZoom = 2;
    const minSize = 0;
    const maxSize = 10;

    return (
      minSize +
      ((maxSize - minSize) / (maxZoom - minZoom)) * (currentZoom - minZoom)
    );
  };
  useEffect(() => {
    const indexes = Object.keys(topics);
    const transformed = indexes.map((index) => {
      const topic = topics[index];
      const center = h3.cellToLatLng(index).reverse();
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: center,
        },
        properties: {
          h3Index: index,
          iconId: topics[index].icon,
          iconSize: 100,
          iconOffset: 0,
          allowOverlap: true,
          // backgroundPattern: "background",
          allowIconOverlap: true,
        },
        id: index,
      };
    });
    if (transformed.length) {
      setTransformedTopics(transformed);
    }
  }, [topics]);

  if (!transformedTopics || !transformedTopics.length) return null;

  return transformedTopics.map((topic: TopicData) => (
    <MarkerView
      coordinate={topic.geometry.coordinates}
      pointerEvents="none"
      allowOverlap
      key={topic.id}
    >
      <TouchableOpacity
        style={styles.markerContainer}
        onPress={() => {
          // console.log("topic id ===>", topic.id);
          let geometry = {
            type: "Polygon",
            coordinates: [h3.cellToBoundary(topic.id, true)],
          };

          const polygon = {
            type: "Feature",
            geometry,
            properties: {
              h3Index: topic.id,
            },
          };

          // console.log("hexagon ===>", polygon);
          setSelectedPolygon(polygon);
          setSelectedPolygonId(topic.id);
        }}
      >
        <Image
          source={{
            uri: linkPrefix + topic.properties.iconId,
          }}
          style={[
            styles.markerImage,
            {
              width: 30 + interpolatePinSize(zoomLevel),
              height: 30 + interpolatePinSize(zoomLevel),
              borderRadius: 30 + interpolatePinSize(zoomLevel) / 2,
            },
          ]}
        />
      </TouchableOpacity>
    </MarkerView>
  ));
};
