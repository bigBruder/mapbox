import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Modal,
  NativeModules,
  SafeAreaView,
  Image,
} from "react-native";
import Mapbox from "@rnmapbox/maps";

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
import { Marker } from "../marker/Marker";
import { Tag } from "../tag/Tag";
import useLocation from "../../hooks/useLocation";
import { mockMarkers } from "../../utils/mockMarkers";
import MapContext from "../../providers/MapContext";
const { StatusBarManager } = NativeModules;

export const Map = () => {
  const myLocation = useLocation();

  const { pointsOfInterest, selectedMarker, setSelectedMarker, loading } =
    useContext(MapContext);

  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Next Month");

  const map = useRef<Mapbox.MapView | null>(null);
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    // @ts-ignore
    if (!map.current?.flyTo) return;
    // @ts-ignore
    map.current.flyTo({ center: myLocation });
  }, [myLocation]);

  if (loading) {
    return (
      <SafeAreaView style={styles.page}>
        <Image
          source={require("../../assets/loading_screen_map.png")}
          style={styles.absoluteFillObject}
          resizeMode="cover"
        />
        <StatusBar translucent backgroundColor="transparent" style="light" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.page}>
      <GestureHandlerRootView style={styles.container}>
        {/* It need to avoid bug of mapbox related with displaying of images */}
        {pointsOfInterest &&
          pointsOfInterest.map((point, id) => (
            <ImageBackground
              source={{ uri: point["iconUrl"] }}
              style={{ width: 50, height: 50, display: "none" }}
              key={id}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                }}
              ></View>
            </ImageBackground>
          ))}

        <View style={styles.container}>
          <View style={styles.container}>
            <Mapbox.MapView
              style={styles.map}
              scaleBarEnabled={false}
              ref={map}
              rotateEnabled={false}
            >
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
              {mockMarkers.map((marker) => (
                <Marker key={marker.id} marker={marker} />
              ))}

              {
                <Mapbox.Camera
                  maxZoomLevel={30}
                  zoomLevel={5}
                  followZoomLevel={15}
                  animationDuration={1500}
                  centerCoordinate={myLocation || undefined}
                />
              }
              {pointsOfInterest &&
                pointsOfInterest.map((point, id) => (
                  <Mapbox.PointAnnotation
                    key={(
                      point["longitude"] +
                      point["latitude"] +
                      id
                    ).toString()}
                    id={(
                      point["longitude"] +
                      point["latitude"] +
                      id
                    ).toString()}
                    coordinate={[point["longitude"], point["latitude"]]}
                    onSelected={() => {
                      if (selectedMarker === point) {
                        setSelectedMarker(null);
                      } else {
                        setSelectedMarker(point);
                      }
                    }}
                  >
                    {/* It need to avoid bug of mapbox related with displaying of images */}

                    <View style={styles.annotationContainer}>
                      <Text
                        style={{
                          lineHeight: 25,
                          textAlignVertical: "top",
                          fontSize: 30,
                          height: 30,
                        }}
                      >
                        <Image
                          source={{ uri: point["iconUrl"] }}
                          style={{ width: 30, height: 30 }}
                          resizeMode="cover"
                        />
                      </Text>
                    </View>

                    <Mapbox.Callout title={point["name"]} />
                  </Mapbox.PointAnnotation>
                ))}
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
                    {mockTags &&
                      mockTags.map((tag, id) => <Tag key={id} tag={tag} />)}
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
          <StatusBar />
        </View>
        {selectedMarker && (
          <Bottomsheet
            selectedMarker={selectedMarker}
            onClose={() => setSelectedMarker(null)}
          />
        )}
      </GestureHandlerRootView>
      <StatusBar
        translucent
        backgroundColor={showModal ? "white" : "transparent"}
      />
    </SafeAreaView>
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
