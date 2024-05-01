import MapboxGL from "@rnmapbox/maps";
import { StyleSheet, Text, View } from 'react-native';

export const Marker = ({ marker }: {marker: Marker}) => {
    return (
        <MapboxGL.PointAnnotation
            key={marker.id}
            id={marker.id}
            coordinate={marker.coordinate}>
            <View style={styles.annotationContainer}>
              <Text style={styles.annotationText}>{marker.title}</Text>
            </View>
            <MapboxGL.Callout title={marker.title} />
          </MapboxGL.PointAnnotation>
    );
}

const styles = StyleSheet.create({
    annotationContainer: {
      width: 50,
      height: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: 'blue',
      borderStyle: 'solid',
    },
    annotationText: {
      fontSize: 24,
    },
  });