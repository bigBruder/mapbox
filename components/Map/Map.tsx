import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  NativeModules,
  SafeAreaView,
  Image,
  ImageBackground,
} from "react-native";
import Mapbox, { BackgroundLayer } from "@rnmapbox/maps";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  CalendarIcon,
  LocationIcon,
  PlusIcon,
  ProfileIcon,
  SearchIcon,
  ShareIcon,
} from "../../assets/icons";
import { DateSelectionModal } from "../DateSelectionModal/DateSelectionModal";
import { mockTags } from "../../utils/mockTags";
import Bottomsheet from "../../utils/BottomSheet";
import { useContext, useEffect, useRef, useState } from "react";
import { Tag } from "../tag/Tag";
import useLocation from "../../hooks/useLocation";
import MapContext from "../../providers/MapContext";
import { getIconUrl } from "../../utils/getIconUrl";
import { transformDataToHeatmap } from "../../utils/transformDataToHeatData";
const { StatusBarManager } = NativeModules;

export const Map = () => {
  const myLocation = useLocation();

  const {
    pinsForBound,
    pointsOfInterest,
    selectedMarker,
    setSelectedMarker,
    loading,
    pins,
    tags,
    heatMap,
    cameraBound,
    setCameraBound,
  } = useContext(MapContext);

  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Next Month");

  const map = useRef<Mapbox.MapView | null>(null);
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  // useEffect(() => {
  //   // @ts-ignore
  //   if (!map.current?.flyTo) return;
  //   // @ts-ignore
  //   console.log("myLocation", map.current);
  //   map.current.flyTo({ center: myLocation });
  // }, [myLocation]);

  if (loading) {
    return (
      <View style={styles.page}>
        <Image
          source={require("../../assets/loading_screen_map.png")}
          style={styles.absoluteFillObject}
          resizeMode="cover"
        />
        <StatusBar translucent backgroundColor="transparent" style="light" />
      </View>
    );
  }

  // useEffect(() => {
  //   if (map?.current) {
  //     console.log(
  //       "map.current ====> ",
  //       map?.current,
  //       "    "
  //       // map.current._turboModule.getVisibleBounds(
  //       //   map?.current?._nativeRef.current
  //       // )
  //     );
  //   }
  // }, [map]);

  // console.log("map.current ====> ", map.current);

  // console.log("map PINS +++>", pins);

  const heatmapData = [
    {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            intensity: 11,
          },
          geometry: {
            type: "Point",
            coordinates: [-75.0396486, 40.06324964],
          },
        },
        {
          type: "Feature",
          properties: {
            intensity: 6,
          },
          geometry: {
            type: "Point",
            coordinates: [-75.02378225, 40.04546552],
          },
        },
        {
          type: "Feature",
          properties: {
            intensity: 6,
          },
          geometry: {
            type: "Point",
            coordinates: [-75.05326856, 40.04438827],
          },
        },
        {
          type: "Feature",
          properties: {
            intensity: 5,
          },
          geometry: {
            type: "Point",
            coordinates: [-75.02601785, 40.0821139],
          },
        },
        {
          type: "Feature",
          properties: {
            intensity: 3,
          },
          geometry: {
            type: "Point",
            coordinates: [-75.09864227, 40.06107939],
          },
        },
        {
          type: "Feature",
          properties: {
            intensity: 1,
          },
          geometry: {
            type: "Point",
            coordinates: [-75.06914588, 40.06216826],
          },
        },
      ],
      // styles: {
      //   heatmapRadius: 100,
      //   heatmapWeight: 1,
      //   heatmapIntensity: 11,
      //   heatmapOpacity: 0.3,
      // },
    },
  ];

  // console.log("heatmapData", transformDataToHeatmap(heatMap));

  return (
    <View style={styles.page}>
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.container}>
          <View style={styles.container}>
            <Mapbox.MapView
              style={styles.map}
              scaleBarEnabled={false}
              ref={map}
              rotateEnabled={false}
              styleURL="mapbox://styles/vibespot/clvfm2nfq010401q14frq08bd"
              regionDidChangeDebounceTime={5000}
              // onRegionDidChange={(e) => {
              //   console.log("e", e);
              // }}
              onMapIdle={(e) => {
                setCameraBound(e);
              }}
            >
              {/* <Mapbox.HeatmapLayer
                id="my-heatmap-layer"
                sourceID="my-heatmap-source"
                sourceLayerID=""
                layerIndex={0}
                filter={[]}
                minZoomLevel={0}
                maxZoomLevel={24}
                style={{
                  heatmapRadius: 30,
                  heatmapWeight: 1,
                  heatmapIntensity: 11,
                  heatmapOpacity: 0.3,
                }}
              /> */}
              {/* {transformDataToHeatmap(heatMap).map((data, index) => (
                <Mapbox.HeatmapLayer
                  key={data.features.toString() + index.toString()}
                  id={`my-heatmap-source-${index}`}
                  sourceID={`my-heatmap-source-${index}`}
                  aboveLayerID="waterway-label"
                  sourceLayerID=""
                  layerIndex={5}
                  filter={[]}
                  minZoomLevel={0}
                  maxZoomLevel={20}
                  style={{
                    heatmapRadius: 30,
                    heatmapWeight: 1,
                    heatmapIntensity: 11,
                    heatmapOpacity: 0.5,
                  }}
                />
              ))}
              {transformDataToHeatmap(heatMap).map((data, index) => (
                <Mapbox.ShapeSource
                  id={`my-heatmap-source-${index}`}
                  shape={data}
                  key={data.toString() + index}
                />
              ))} */}
              {pinsForBound &&
                pinsForBound.map((pin, index) => (
                  <Mapbox.MarkerView
                    key={pin.longitude + pin.latitude + index.toString()}
                    id={index.toString()}
                    coordinate={[
                      pin.venue.geo.longitude,
                      pin.venue.geo.latitude,
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        if (selectedMarker === pin) {
                          setSelectedMarker(null);
                        } else {
                          setSelectedMarker(pin);
                        }
                      }}
                    >
                      {pin.id === selectedMarker?.id ? (
                        <ImageBackground
                          source={require("../../assets/active_pin_background.png")}
                          style={{
                            width: 50,
                            height: 50,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          resizeMethod="resize"
                        >
                          <Image
                            source={{
                              uri: getIconUrl(pin.icon.split(":")[1]),
                            }}
                            style={{ width: 30, height: 30 }}
                          />
                        </ImageBackground>
                      ) : (
                        <Image
                          source={{
                            uri: getIconUrl(pin.icon.split(":")[1]),
                          }}
                          style={{ width: 30, height: 30 }}
                        />
                      )}
                    </TouchableOpacity>
                  </Mapbox.MarkerView>
                ))}

              {myLocation && (
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
              )}
              {
                <Mapbox.Camera
                  maxZoomLevel={30}
                  zoomLevel={5}
                  followZoomLevel={15}
                  animationDuration={1500}
                  centerCoordinate={myLocation || undefined}
                />
              }
            </Mapbox.MapView>
            <View style={styles.topContainer}>
              <View style={styles.upperContainer}>
                <TouchableOpacity style={styles.searchButton}>
                  <ProfileIcon />
                </TouchableOpacity>
                <View style={styles.searchContainer}>
                  <SearchIcon />
                  <TextInput placeholder="Search" style={styles.search} />
                </View>
                <TouchableOpacity style={styles.searchButton}>
                  <ShareIcon />
                </TouchableOpacity>
              </View>
              <View style={styles.tagsContainer}>
                <Modal visible={showModal} animationType="slide">
                  <DateSelectionModal
                    onSelect={handleDateSelect}
                    onCloseModal={setShowModal}
                    selectedDate={selectedDate}
                  />
                </Modal>

                <>
                  <TouchableOpacity
                    style={styles.calendarContainer}
                    onPress={() => setShowModal(true)}
                  >
                    <CalendarIcon style={styles.calendarIcon} />
                    <Text>{selectedDate}</Text>
                  </TouchableOpacity>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {tags && tags.map((tag, id) => <Tag key={id} tag={tag} />)}
                    {/* {mockTags &&
                      mockTags.map((tag, id) => <Tag key={id} tag={tag} />)} */}
                  </ScrollView>
                </>
              </View>
            </View>
            <View style={styles.bottomContainer}>
              <TouchableOpacity style={styles.searchButton}>
                <LocationIcon />
              </TouchableOpacity>
              <Text style={styles.pointText}>Somse points</Text>
              <TouchableOpacity style={styles.addButton} onPress={() => {}}>
                <PlusIcon />
              </TouchableOpacity>
            </View>
          </View>
          {/* <StatusBar /> */}
        </View>
        {selectedMarker && (
          <Bottomsheet
            selectedMarker={selectedMarker}
            onClose={() => setSelectedMarker(null)}
          />
        )}
      </GestureHandlerRootView>
      <StatusBar
        // translucent
        backgroundColor={showModal ? "white" : "transparent"}
        // style="dark"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    height: "100%",
    width: "100%",
    position: "relative",
  },
  map: {
    flex: 1,
  },
  topContainer: {
    position: "absolute",
    width: "100%",
    top: StatusBarManager.HEIGHT + 10,
    padding: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    gap: 10,
  },
  upperContainer: {
    width: "100%",
    overflow: "hidden",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  bottomContainer: {
    position: "absolute",
    width: "100%",
    bottom: 40,
    padding: 24,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  pointText: {
    fontSize: 18,
    lineHeight: 22,
    textAlign: "left",
    color: "white",
    fontFamily: "SF Pro Text",
    flex: 1,
  },
  annotationContainer: {
    width: 50,
    height: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 0,
    borderColor: "white",
    borderStyle: "solid",
  },
  annotationText: {
    fontSize: 24,
  },
  searchButton: {
    width: 40,
    height: 40,
    backgroundColor: "white",
    borderRadius: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: "#005DF2",
    borderRadius: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "white",
    height: 40,
    borderColor: "gray",
    borderRadius: 40,
    padding: 10,
    flex: 1,
  },
  search: {
    flex: 1,
    height: 40,
  },
  addMarkerContainer: {
    position: "absolute",
    bottom: "40%",
    width: "60%",
    backgroundColor: "white",
    padding: 24,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    gap: 10,
  },
  window: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  addInput: {
    width: "100%",
    height: 40,
    backgroundColor: "white",
    borderColor: "gray",
    borderRadius: 40,
    padding: 10,
    borderWidth: 1,
  },
  tagsContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  calendarContainer: {
    height: 28,
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    borderRadius: 30,
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: "600",
  },
  calendarIcon: {
    width: 16,
    height: 16,
    objectFit: "contain",
  },
  modal: {
    backgroundColor: "red",
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  absoluteFillObject: {
    width: "100%",
    height: "100%",
  },
});
