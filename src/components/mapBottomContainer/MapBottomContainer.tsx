import { TouchableOpacity, View, Text } from "react-native";
import { LocationIcon, PlusIcon } from "../../assets/icons";
import { styles } from "./styles";
import { FC } from "react";

interface Props {
  handleCenterCamera: () => Promise<void>;
}

export const MapBottomContainer: FC<Props> = ({ handleCenterCamera }) => {
  return (
    <View style={styles.bottomContainer} pointerEvents="box-none">
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => handleCenterCamera()}
      >
        <LocationIcon />
      </TouchableOpacity>
      <View style={styles.regionContainer} pointerEvents="box-none">
        <Text style={styles.pointText}>Some point</Text>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => {}}>
        <PlusIcon />
      </TouchableOpacity>
    </View>
  );
};
