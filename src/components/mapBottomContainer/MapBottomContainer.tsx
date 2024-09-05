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
import ManIcon from "@/assets/icons/man";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/userStore";
import { useCameraStore } from "@/store/CameraStore";
import LocationIcon from "@/assets/icons/location";
import PointIcon from "@/assets/icons/point";
import { useHexagonsStore } from "@/store/hexagonsStore";

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

  const { realtimeZoomDebug } = useCameraStore((state) => ({
    realtimeZoomDebug: state.realTimeZoomDebug,
  }));

  const { h3Index } = useHexagonsStore((state) => ({
    h3Index: state.h3Index,
  }));

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

  // if (!camera) return null;

  return (
    <View style={styles.bottomContainer} pointerEvents="box-none">
      <View style={styles.regionContainer} pointerEvents="box-none">
        <PointIcon style={styles.regionShadow} />
        <Text style={[styles.pointText, styles.regionShadow]}>
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
            // toggleSelectedProjection();
          }}
          style={[styles.addButton, { alignItems: "center" }]}
        >
          <PlusIcon />
        </TouchableOpacity>
      </View>

      {/* Degub features */}
      <DebugFeatures
        h3Index={h3Index}
        realtimeZoomDebug={realtimeZoomDebug}
        toggleUser={toggleUser}
        selectedProjection={selectedProjection}
        toggleSelectedProjection={toggleSelectedProjection}
      />
    </View>
  );
};

const DebugFeatures = ({
  h3Index,
  realtimeZoomDebug,
  toggleUser,
  selectedProjection,
  toggleSelectedProjection,
}: {
  h3Index: number;
  realtimeZoomDebug: number;
  toggleUser: () => void;
  selectedProjection: string;
  toggleSelectedProjection: () => void;
}) => {
  return (
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
              fontSize: 5,
            }}
          >
            H3
          </Text>
          {h3Index}
        </Text>
      </TouchableOpacity>
      <ImageBackground source={require("@/assets/icons/pulse")}>
        <TouchableOpacity
          style={{
            backgroundColor: colors.pulsePrimary,
            paddingVertical: 10,
            paddingHorizontal: 5,
            borderRadius: 30,
          }}
        >
          <Text
            style={{
              width: 35,
              textAlign: "center",
              color: "white",
              fontWeight: "600",
              fontSize: 14,
            }}
          >
            {realtimeZoomDebug.toFixed(1)}
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
  );
};
