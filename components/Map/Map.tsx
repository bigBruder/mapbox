import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  ImageBackground,
} from "react-native";
import Mapbox, { Camera } from "@rnmapbox/maps";

import { styles } from "./styles";

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
import Bottomsheet from "../../utils/BottomSheet";
import { useContext, useRef, useState } from "react";
import { Tag } from "../tag/Tag";
import useLocation from "../../hooks/useLocation";
import MapContext from "../../providers/MapContext";
import { getIconUrl } from "../../utils/getIconUrl";
import { transformDataToHeatmap } from "../../utils/transformDataToHeatData";
import { CameraBound } from "../../types/CameraBound";

export const Map = () => {
  const myLocation = useLocation();

  const {
    pinsForBound,
    selectedMarker,
    setSelectedMarker,
    loading,
    tags,
    heatMap,
    setCameraBound,
    selectedTags,
    setSelectedTags,
  } = useContext(MapContext);

  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Next Month");

  const map = useRef<Mapbox.MapView | null>(null);
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

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
  //   {
  //     type: "FeatureCollection",
  //     features: [
  //       {
  //         type: "Feature",
  //         properties: {
  //           intensity: 11,
  //         },
  //         geometry: {
  //           type: "Point",
  //           coordinates: [-75.0396486, 40.06324964],
  //         },
  //       },
  //       {
  //         type: "Feature",
  //         properties: {
  //           intensity: 6,
  //         },
  //         geometry: {
  //           type: "Point",
  //           coordinates: [-75.02378225, 40.04546552],
  //         },
  //       },
  //       {
  //         type: "Feature",
  //         properties: {
  //           intensity: 6,
  //         },
  //         geometry: {
  //           type: "Point",
  //           coordinates: [-75.05326856, 40.04438827],
  //         },
  //       },
  //       {
  //         type: "Feature",
  //         properties: {
  //           intensity: 5,
  //         },
  //         geometry: {
  //           type: "Point",
  //           coordinates: [-75.02601785, 40.0821139],
  //         },
  //       },
  //       {
  //         type: "Feature",
  //         properties: {
  //           intensity: 3,
  //         },
  //         geometry: {
  //           type: "Point",
  //           coordinates: [-75.09864227, 40.06107939],
  //         },
  //       },
  //       {
  //         type: "Feature",
  //         properties: {
  //           intensity: 1,
  //         },
  //         geometry: {
  //           type: "Point",
  //           coordinates: [-75.06914588, 40.06216826],
  //         },
  //       },
  //     ],
  //     // styles: {
  //     //   heatmapRadius: 100,
  //     //   heatmapWeight: 1,
  //     //   heatmapIntensity: 11,
  //     //   heatmapOpacity: 0.3,
  //     // },
  //   },
  // ];

  const handleSelectTag = (tag: string) => {
    if (selectedTags?.includes(tag)) {
      setSelectedTags(
        selectedTags.filter((selectedTag) => selectedTag !== tag)
      );
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

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
              regionDidChangeDebounceTime={3000}
              onMapIdle={(e) => {
                setCameraBound(e as CameraBound);
              }}
            >
              {transformDataToHeatmap(heatMap).map((data, index) => {
                console.log(
                  "intensity",
                  data?.features[0]?.properties?.intensity / 100
                );
                return (
                  <Mapbox.HeatmapLayer
                    key={data.features.toString() + index.toString()}
                    id={`my-heatmap-source-${index}`}
                    sourceID={`my-heatmap-source-${index}`}
                    aboveLayerID="waterway-label"
                    sourceLayerID=""
                    layerIndex={5}
                    filter={[]}
                    minZoomLevel={0.5}
                    maxZoomLevel={8}
                    style={{
                      heatmapRadius:
                        data?.features[0]?.properties?.intensity / 25 || 30,
                      heatmapWeight: 1,
                      heatmapIntensity:
                        data?.features[0]?.properties?.intensity / 1000 || 0,
                      heatmapOpacity: 1,
                      heatmapColor: [
                        "interpolate",
                        ["linear"],
                        ["heatmap-density"],
                        0,
                        "rgba(0, 255, 0, 0)", // No heatmap intensity: transparent
                        0.1,
                        "rgba(0, 255, 0, 0.3)", // Green with some opacity
                        0.2,
                        "rgba(64, 255, 0, 0.4)", // Green with some opacity
                        0.3,
                        "rgba(128, 255, 0, 0.4)", // Green with some opacity
                        0.4,
                        "rgba(191, 255, 0, 0.4)", // Green with some opacity
                        0.5,
                        "rgba(255, 255, 0, 0.5)", // Yellow with some opacity
                        0.6,
                        "rgba(255, 191, 0, 0.6)", // Yellow with some opacity
                        0.7,
                        "rgba(255, 128, 0, 0.7)", // Orange with some opacity
                        0.8,
                        "rgba(255, 64, 0, 0.8)", // Red-Orange with some opacity
                        0.9,
                        "rgba(255, 0, 0, 0.9)", // Red with some opacity
                        1,
                        "rgba(255, 0, 0, 0.95)", // High intensity: Red with more opacity
                      ],
                    }}
                  />
                );
              })}
              {transformDataToHeatmap(heatMap).map((data, index) => (
                <Mapbox.ShapeSource
                  id={`my-heatmap-source-${index}`}
                  shape={data}
                  key={data.toString() + index}
                />
              ))}
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
                    {selectedTags &&
                      selectedTags.map((tag, id) => (
                        <TouchableOpacity onPress={() => handleSelectTag(tag)}>
                          <Tag key={id} tag={tag} isActive={true} />
                        </TouchableOpacity>
                      ))}
                    {tags &&
                      tags
                        .filter((tag) => !selectedTags.includes(tag))
                        .map((tag, id) => (
                          <TouchableOpacity
                            onPress={() => handleSelectTag(tag)}
                            key={tag}
                          >
                            <Tag key={id} tag={tag} />
                          </TouchableOpacity>
                        ))}
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
        </View>
        {selectedMarker && (
          <Bottomsheet
            selectedMarker={selectedMarker}
            onClose={() => setSelectedMarker(null)}
          />
        )}
      </GestureHandlerRootView>
      <StatusBar backgroundColor={showModal ? "white" : "transparent"} />
    </View>
  );
};
