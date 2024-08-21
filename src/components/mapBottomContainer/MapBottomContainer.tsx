import { FC, useEffect, useState } from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";
import { CameraBound } from "@/types/CameraBound";
import { getRegionInfo } from "@/api/client";
import { getRegionName } from "@/helpers/getRegionName";
import { LocationIcon, PlusIcon } from "@/assets/icons";
import { styles } from "./styles";
import { useMapStore } from "@/store/MapStore";
import { useNavigation } from "@react-navigation/native";
import PulseIcon from "@/assets/icons/pulse";
import ManIcon from "@/assets/icons/man";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/userStore";

interface Props {
  handleCenterCamera: () => Promise<void>;
  camera: CameraBound | null;
}

export const MapBottomContainer: FC<Props> = ({ handleCenterCamera }) => {
  const { toggleUser } = useUserStore((state) => state);
  const [regionName, setRegionName] = useState<String>("");
  const camera = useMapStore((state) => state.camera);
  const { selectedProjection, toggleSelectedProjection } = useMapStore(
    (state) => ({
      selectedProjection: state.selectedProjection,
      toggleSelectedProjection: state.toggleSelectedProjection,
    })
  );

  const navigation = useNavigation();

  useEffect(() => {
    if (!camera) return;
    try {
      getRegionInfo(camera.properties.center, camera.properties.zoom).then(
        (regionInfo) => {
          const featureName = getRegionName(
            regionInfo.features,
            camera.properties.zoom
          );
          if (featureName === regionName) return;
          setRegionName(featureName || "");
        }
      );
    } catch (error) {
      console.error("Error fetching region info:", error);
    }
  }, [camera?.properties.center, camera?.properties.zoom]);

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
          {camera?.properties?.zoom < 2 || !regionName
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
      ></View>
      <TouchableOpacity
        onPress={() => {
          toggleSelectedProjection();
        }}
        style={[styles.addButton, { alignItems: "center" }]}
      >
        <Image
          source={require("@/assets/icons/earth.png")}
          style={{
            width: 20,
            height: 20,
            backgroundColor: "white",
            borderRadius: 10,
            opacity: selectedProjection === "globe" ? 1 : 0.7,
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          margin: 10,
          backgroundColor: colors.pulsePrimary,
          padding: 10,
          borderRadius: 30,
        }}
        onPress={() => {
          toggleUser();
        }}
      >
        <ManIcon fill="white" />
      </TouchableOpacity>
    </View>
  );
};
