import { FC, useEffect, useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  ImageBackground,
} from "react-native";
import { CameraBound } from "@/types/CameraBound";
import { getRegionInfo } from "@/api/client";
import { getRegionName } from "@/helpers/getRegionName";
import { PlusIcon } from "@/assets/icons";
import { styles } from "./styles";
import { useMapStore } from "@/store/MapStore";
import { useNavigation } from "@react-navigation/native";
import PulseIcon from "@/assets/icons/pulse";
import ManIcon from "@/assets/icons/man";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/userStore";
import { useCameraStore } from "@/store/CameraStore";
import LocationIcon from "@/assets/icons/location";
import PointIcon from "@/assets/icons/point";

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
  const { realtimeZoom } = useCameraStore((state) => ({
    realtimeZoom: state.realTimeZoom,
  }));

  const navigation = useNavigation();

  const getHexagonsResolutionByZoom = (zoom: number) => {
    switch (true) {
      case zoom <= 3:
        return 1;
      case zoom > 3 && zoom <= 5:
        return 2;
      case zoom <= 6:
        return 2;
      case zoom <= 7:
        return 3;
      case zoom <= 8:
        return 5;
      case zoom <= 10:
        return 5;
      case zoom <= 11:
        return 6;
      case zoom <= 12:
        return 7;
      case zoom <= 14:
        return 8;
      case zoom <= 16:
        return 9;
      default:
        return 9;
    }
  };

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
      <View style={styles.regionContainer} pointerEvents="box-none">
        <PointIcon />
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
          gap: 24,
          alignItems: "center",

          backgroundColor: "transparent",
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 20,
          elevation: 20,
        }}
      >
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => handleCenterCamera()}
        >
          <LocationIcon />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            toggleSelectedProjection();
          }}
          style={[styles.addButton, { alignItems: "center" }]}
        >
          <PlusIcon />
          {/* <Image
            source={require("@/assets/icons/plus.png")}
            style={{
              width: 20,
              height: 20,
              backgroundColor: "white",
              borderRadius: 10,
              opacity: selectedProjection === "globe" ? 1 : 0.7,
            }} */}
          {/* /> */}
        </TouchableOpacity>
      </View>

      {/* Degub features */}
      <View
        style={{
          position: "absolute",
          bottom: 200,
          left: 0,
          opacity: 0.5,
          alignItems: "center",
          backgroundColor: "white",
          borderBottomRightRadius: 10,
          borderTopRightRadius: 10,
        }}
      >
        <TouchableOpacity
          style={{
            margin: 10,
            backgroundColor: colors.pulsePrimary,
            padding: 10,
            borderRadius: 30,
          }}
        >
          <Text
            style={{
              width: 20,
              textAlign: "center",
              color: "white",
              fontWeight: "600",
              fontSize: 16,
            }}
          >
            <Text
              style={{
                fontSize: 10,
              }}
            >
              H3
            </Text>
            {getHexagonsResolutionByZoom(realtimeZoom)}
          </Text>
        </TouchableOpacity>
        <ImageBackground source={require("@/assets/icons/pulse")}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.pulsePrimary,
              padding: 10,
              borderRadius: 30,
            }}
          >
            <Text
              style={{
                width: 20,
                textAlign: "center",
                color: "white",
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              {realtimeZoom}
            </Text>
          </TouchableOpacity>
        </ImageBackground>
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
        <TouchableOpacity
          onPress={() => {
            toggleSelectedProjection();
          }}
          style={{
            margin: 10,
            backgroundColor: colors.pulsePrimary,
            padding: 10,
            borderRadius: 30,
          }}
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
      </View>
    </View>
  );
};
