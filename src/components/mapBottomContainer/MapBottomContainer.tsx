import { TouchableOpacity, View, Text } from "react-native";
import { LocationIcon, PlusIcon } from "../../assets/icons";
import { FC, useEffect, useState } from "react";
import { CameraBound } from "../../types/CameraBound";
import { getRegionInfo } from "../../api/client";
import { getRegionName } from "../../helpers/getRegionName";

import { styles } from "./styles";

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
    try {
      getRegionInfo(
        cameraBound.properties.center,
        cameraBound.properties.zoom
      ).then((regionInfo) => {
        const featureName = getRegionName(
          regionInfo.features,
          cameraBound.properties.zoom
        );
        setRegionName(featureName);
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
