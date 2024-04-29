import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Platform, TextInput, TouchableOpacity, Image, Alert, NativeModules, SafeAreaView, Share, ImageBackground } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { mockMarkers } from './utils/mockMarkers';
import { Marker } from './components/marker/Marker';
import { mockTags } from './utils/mockTags';
import { Tag } from './components/tag/Tag';
import useLocation from './hooks/useLocation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ProfileIcon, SearchIcon, ShareIcon, CalendarIcon, PlusIcon, LocationIcon } from './assets/icons';
import { getPoints } from './api/client';

import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();


const { StatusBarManager } = NativeModules;

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_API_KEY || null);

export default function App() {
  const myLocation = useLocation();
  const [pointsOfInterest, setPointsOfInterest] = useState(null);
  const [loading, setLoading] = useState(false);

  const map = useRef(null);

  const onLayoutRootView = useCallback(async () => {
    if (!loading) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [loading]);

  

  useEffect(() => {
    if (!map.current?.flyTo) return;
    map.current.flyTo({ center: myLocation });
  }, [myLocation]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const points = await getPoints();
        console.log('points => ', points);
        setPointsOfInterest(points);
      } catch (error) {
        console.error('Error fetching points:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.page}>
 {/* It need to avoid bug of mapbox related with displaying of images */}
{
          pointsOfInterest && pointsOfInterest.map((point, id) => (
            <ImageBackground source={{uri: point['iconUrl']}} style={{width: 50, height: 50, display: 'none'}} key={id}>
              <View style={
                {
                  width: 50,
                  height: 50,
                }
              
              }>
                
              </View>
            </ImageBackground>

          ))
        } 
          
    <View style={styles.container}>
      <View style={styles.container}>
        <Mapbox.MapView style={styles.map} 
          scaleBarEnabled={false}
          ref={map}
          rotateEnabled={false}
        >
        {
          myLocation && (
            <Mapbox.PointAnnotation
              key="pointAnnotation"
              id="pointAnnotation"
              coordinate={myLocation}
              >
              <View>
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
          <Mapbox.Camera
            maxZoomLevel={30}
            zoomLevel={5}
            followZoomLevel={15}
            animationDuration={1500}
            centerCoordinate={myLocation}
          />
        }
        {
          pointsOfInterest && pointsOfInterest.map((point, id) => (
            <Mapbox.PointAnnotation
              key={(point['longitude'] + point['latitude'] + id).toString()}
              id={(point['longitude'] + point['latitude'] + id).toString()}
              coordinate={[point['longitude'], point['latitude']]}>
                 {/* It need to avoid bug of mapbox related with displaying of images */}
                <Text style={{lineHeight: 25, textAlignVertical: 'top', fontSize: 30, height: 30
                }}>
                  <Image source={{uri: point['iconUrl']}} style={{width: 30, height: 30}} resizeMode='cover' />
                </Text>

              <Mapbox.Callout title={point['name']} />
            </Mapbox.PointAnnotation>
          ))
        }
          
        </Mapbox.MapView>
        <View style={styles.topContainer}>
          <View style={styles.upperContainer}>
            <TouchableOpacity style={styles.searchButton}>
              <ProfileIcon />
            </TouchableOpacity>
            <View style={styles.searchContainer}>
              <SearchIcon />
              <TextInput placeholder="Search" style={styles.search}/>
            </View>
            <TouchableOpacity style={styles.searchButton}>
              <ShareIcon />
            </TouchableOpacity>
          </View>
          <View style={styles.tagsContainer}>
            <>
            <View style={styles.calendarContainer}>
              <CalendarIcon style={styles.calendarIcon} />
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
            <LocationIcon />
          </TouchableOpacity>
          <Text style={styles.pointText}>Some point</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => {
          }}>
            <PlusIcon />
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="auto" />
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
