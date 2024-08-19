import { TouchableOpacity, Text, View } from "react-native";

import { useCameraStore } from "@/store/CameraStore";
import { useHexagonsStore } from "@/store/hexagonsStore";

import { getH3ResolutionByZoom } from "@/utils/polygonsUtils";

import styles from "./styles";

export const HexagonsDebugContainer = () => {
  const { h3Index, setH3Index } = useHexagonsStore((state) => ({
    h3Index: state.h3Index,
    setH3Index: state.setH3Index,
  }));
  const { isAutoH3Index, toggleIsAutoH3Index } = useHexagonsStore((state) => ({
    isAutoH3Index: state.isAutoH3Index,
    toggleIsAutoH3Index: state.toggleIsAutoH3Index,
  }));

  const { realTimeZoom } = useCameraStore((state) => ({
    realTimeZoom: state.realTimeZoom,
  }));

  return (
    <View
      style={{
        position: "absolute",
        bottom: 200,
        right: 30,
      }}
    >
      {!isAutoH3Index ? (
        <>
          <TouchableOpacity
            onPress={() => {
              setH3Index(h3Index + 1);
            }}
            style={[styles.h3Button, h3Index >= 9 && styles.buttonDisabled]}
            disabled={h3Index >= 9}
          >
            <Text>+</Text>
          </TouchableOpacity>

          <Text
            style={{
              padding: 10,
              borderRadius: 10,
              color: "white",
              fontSize: 18,
            }}
          >
            <Text style={{ textAlign: "center" }}>{h3Index}</Text>
          </Text>
          <TouchableOpacity
            onPress={() => {
              setH3Index(h3Index - 1);
            }}
            style={[styles.h3Button, h3Index <= 2 && styles.buttonDisabled]}
            disabled={h3Index <= 1}
          >
            <Text>-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => toggleIsAutoH3Index()}
            style={[
              styles.h3Button,
              !isAutoH3Index && styles.buttonDisabled,
              { marginTop: 10 },
            ]}
          >
            <Text style={{ textAlign: "center" }}>Auto</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={{ height: 50, justifyContent: "space-between" }}>
          <Text style={{ textAlign: "center", color: "white", fontSize: 20 }}>
            {getH3ResolutionByZoom(realTimeZoom)}
          </Text>
          <TouchableOpacity
            onPress={() => toggleIsAutoH3Index()}
            style={[styles.h3Button, !isAutoH3Index && styles.buttonDisabled]}
          >
            <Text>Auto</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
