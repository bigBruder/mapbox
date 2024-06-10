import { TouchableOpacity, View, Text } from "react-native";
import { LocationIcon, PlusIcon } from "../../assets/icons";
import { FC, useContext, useEffect, useState } from "react";
import { CameraBound } from "../../types/CameraBound";
import { getRegionInfo } from "../../api/client";
import { getRegionName } from "../../helpers/getRegionName";

import { styles } from "./styles";
import MapContext from "../../providers/mapContext/MapContext";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { getPointsThreshold } from "../../helpers/filterMarkersByPoints";
import { colors } from "../../constants/colors";

interface Props {
  handleCenterCamera: () => Promise<void>;
  cameraBound: CameraBound | null;
}

export const MapBottomContainer: FC<Props> = ({ handleCenterCamera }) => {
  const [regionName, setRegionName] = useState<String>("");
  const { cameraBound } = useContext(MapContext);

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
        if (featureName === regionName) return;
        setRegionName(featureName || "");
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
          {cameraBound?.properties?.zoom < 2 || !regionName
            ? "World"
            : regionName
            ? regionName
            : "World"}
        </Text>
      </View>
      <View
        style={{
          opacity: 0.9,
        }}
      >
        <Text
          style={{
            color: colors.white,
            fontSize: 16,
            fontWeight: "bold",
            textAlign: "left",
          }}
        >
          Zoom:{Math.round(cameraBound?.properties.zoom || 0)}{" "}
        </Text>
        <Text
          style={{
            color: colors.white,
            fontSize: 16,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Points: {`>=${getPointsThreshold(cameraBound?.properties.zoom || 0)}`}
        </Text>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => {}}>
        <PlusIcon />
      </TouchableOpacity>
    </View>
  );
};
