import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Platform, TextInput, TouchableOpacity, Image, Alert, NativeModules, SafeAreaView } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { mockMarkers } from './utils/mockMarkers';
import { Marker } from './components/marker/Marker';
import { mockTags } from './utils/mockTags';
import { Tag } from './components/tag/Tag';
import useLocation from './hooks/useLocation';


const { StatusBarManager } = NativeModules;

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_API_KEY || null);

export default function App() {
  const location = useLocation();

  return (
    <SafeAreaView style={styles.page}>
    <View style={styles.container}>
      <View style={styles.container}>
        <Mapbox.MapView style={styles.map} 
          scaleBarEnabled={false}
        >
        {
          location?.longtitude && location?.latitude && (
            <Mapbox.PointAnnotation
              key="pointAnnotation"
              id="pointAnnotation"
              coordinate={[location?.longitude || 36.7783, location?.latitude || 119.4179]}>
              <View style={styles.annotationContainer}>
                <Text style={styles.annotationText}>📍</Text>
              </View>
              <Mapbox.Callout title="This is a point annotation" />
            </Mapbox.PointAnnotation>
          )
        }
        {mockMarkers.map(marker => (
          <Marker key={marker.id} marker={marker} />
        ))}
          {
            location?.longtitude && location?.latitude && (
              <Mapbox.Camera
                zoomLevel={9}
                // centerCoordinate={[-73.989308, 40.741895]}
                centerCoordinate={[location?.longitude || 36.7783, location?.latitude || 119.4179]}
              />
            )
          }
        </Mapbox.MapView>
        <View style={styles.topContainer}>
          <View style={styles.upperContainer}>
            <TouchableOpacity style={styles.searchButton}>
              <Image source={require('./assets/icons/icon_profile.png')}/>
            </TouchableOpacity>
            <View style={styles.searchContainer}>
              <Image source={require('./assets/icons/search.png')} />
              <TextInput placeholder="Search" style={styles.search}/>
            </View>
            <TouchableOpacity style={styles.searchButton}>
              <Image source={require('./assets/icons/icon_share.png')} />
            </TouchableOpacity>
          </View>
          <View style={styles.tagsContainer}>
            <>
            <View style={styles.calendarContainer}>
              <Image source={require('./assets/icons/calendar.png')} style={styles.calendarIcon}/>
              <Text>Next Month</Text>
            </View>
          {
            mockTags && mockTags.map((tag, id) => (
              <Tag key={id} tag={tag} />
            ))
          }
          </>
          </View>
          
        </View>
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.searchButton}>
            <Image source={require('./assets/icons/icon_profile.png')} />
          </TouchableOpacity>
          <Text style={styles.pointText}>Some point</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => {
          }}>
            <Image source={require('./assets/icons/plus.png')} />
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="auto" />

      {/* {
        addingMarker && (
          <View style={styles.window}>
            <View style={styles.addMarkerContainer}>
              <TextInput placeholder="Longtitude" style={styles.addInput} value={newMarker?.longtitude} onChange={
                (e) => {
                  setNewMarker({
                    ...newMarker,
                    longtitude: e.target.value
                  })
                }
              }/>
              <TextInput placeholder="Latitude" style={styles.addInput}
                value={newMarker?.latitude}
                onChange={
                  (e) => {
                    setNewMarker({
                      ...newMarker,
                      latitude: e.target.value
                    })
                  }
                }/>
              <View>
              <TouchableOpacity onPress={() => {
                setAddingMarker(false);
              }}>
                <Text>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                if (newMarker?.longtitude && newMarker?.latitude) {
                  setMarkers([
                    ...markers,
                    {
                      id: `marker-${markers.length + 1}`,
                      coordinate: [parseFloat(newMarker?.longtitude), parseFloat(newMarker?.latitude)],
                      title: emojiArray[Math.floor(Math.random() * emojiArray.length)]
                    }
                  ]);
                  setAddingMarker(false);
                } else {
                  Alert.alert('Please enter longtitude and latitude');
                setAddingMarker(false);
              }
              }}>
                <Text>Add</Text>
              </TouchableOpacity>
              </View>
             
            </View>
          </View>
        )
      } */}
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: '100%',
    width: '100%',
    position: 'relative',
  },
  map: {
    flex: 1
  },
  topContainer: {
    position: 'absolute',
    width: '100%',
    top: StatusBarManager.HEIGHT + 10,
    padding: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 10,
  },
  upperContainer: {
    width: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  bottomContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 40,
    padding: 24,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  pointText: {
    fontSize: 18,
    lineHeight: 22,
    textAlign: 'left',
    color: 'white',
    fontFamily: 'SF Pro Text',
    flex: 1,

  },
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
  },
  annotationText: {
    fontSize: 24,
  },
  searchButton: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: '#005DF2',
    borderRadius: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'white',
    height: 40,
    borderColor: 'gray',
    borderRadius: 40,
    padding: 10,
    flex: 1,
  },
  search: {
    flex: 1,
    height: 40,
  },
  addMarkerContainer: {
    position: 'absolute',
    bottom: '40%',
    width: '60%',
    backgroundColor: 'white',
    padding: 24,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 10,
  },
  window: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addInput: {
    width: '100%',
    height: 40,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderRadius: 40,
    padding: 10,
    borderWidth: 1,
  },
  tagsContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
  calendarContainer: {
    height: 28,
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 16,
    fontWeight: '600',
  },
  calendarIcon: {
    width: 16,
    height: 16,
    objectFit: 'contain',
  }
});
