import { TouchableOpacity, View, Text } from "react-native";
import { LocationIcon, PlusIcon } from "../../assets/icons";
import { styles } from "./styles";
import { FC, useEffect, useState } from "react";
import { CameraBound } from "../../types/CameraBound";
import { getRegionInfo } from "../../api/client";
import { getFeatureTypeByZoom } from "../../helpers/getFeatureTypeByZoom";

interface Props {
  handleCenterCamera: () => Promise<void>;
  cameraBound: CameraBound | null;
}

export const MapBottomContainer: FC<Props> = ({
  handleCenterCamera,
  cameraBound,
}) => {
  const [regionName, setRegionName] = useState<String>("");

  useEffect(() => {
    if (!cameraBound) return;
    console.log("effect");
    try {
      getRegionInfo(
        cameraBound.properties.center.reverse(),
        cameraBound.properties.zoom
      ).then((regionInfo) => {
        console.log(
          regionInfo.features.map((feat) => `type ==> ${feat.place_type}`)
        );
        console.log(getFeatureTypeByZoom(cameraBound.properties.zoom));
        console.log(regionInfo.features.map((feat) => feat.place_type));
        setRegionName(
          regionInfo.features
            .find((feature) =>
              feature.place_type.some(
                (type) =>
                  type === getFeatureTypeByZoom(cameraBound.properties.zoom)
              )
            )
            .place_name.split(",")[0] || "World"
        );
      });
    } catch (error) {
      console.error("Error fetching region info:", error);
    }
  }, [cameraBound?.properties.center, cameraBound?.properties.zoom]);

  return (
    <View style={styles.bottomContainer} pointerEvents="box-none">
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => handleCenterCamera()}
      >
        <LocationIcon />
      </TouchableOpacity>
      <View style={styles.regionContainer} pointerEvents="box-none">
        <Text style={styles.pointText}>
          {regionName && cameraBound && cameraBound?.properties.zoom > 5
            ? regionName
            : "World"}
        </Text>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => {}}>
        <PlusIcon />
      </TouchableOpacity>
    </View>
  );
};
