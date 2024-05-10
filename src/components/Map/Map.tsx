import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
} from "react-native";
import Mapbox from "@rnmapbox/maps";

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
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { Tag } from "../tag/Tag";
import useLocation from "../../hooks/useLocation";
import MapContext from "../../providers/MapContext";
import { transformDataToHeatmap } from "../../utils/transformDataToHeatData";
import { CameraBound } from "../../types/CameraBound";
import { heatmapColor } from "../../constants/heatmapColor";
import { Marker } from "../marker/Marker";
import mapboxStyleUrl from "../../constants/mapStyleUrl";

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
    selectedTag,
    setSelectedTag,
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
              styleURL={mapboxStyleUrl}
              regionDidChangeDebounceTime={100}
              onMapIdle={(e) => {
                setCameraBound(e as CameraBound);
              }}
            >
              {transformDataToHeatmap(heatMap).map((data, index) => {
                return (
                  <Mapbox.HeatmapLayer
                    key={data.features.toString() + index.toString()}
                    id={`my-heatmap-source-${index}`}
                    sourceID={`my-heatmap-source-${index + 1}`}
                    aboveLayerID="waterway-label"
                    sourceLayerID=""
                    layerIndex={5}
                    filter={[]}
                    maxZoomLevel={12}
                    style={{
                      heatmapRadius: data.cellRadius / 1000 || 100,
                      heatmapColor: heatmapColor,
                    }}
                  />
                );
              })}
              {transformDataToHeatmap(heatMap).map((data, index) => (
                <Mapbox.ShapeSource
                  id={`my-heatmap-source-${index + 1}`}
                  shape={data}
                  key={data.toString() + index}
                  paint={{
                    "heatmap-radius":
                      data?.features[0]?.properties?.intensity / 50 || 30,
                    "heatmap-weight": 1,
                    "heatmap-intensity":
                      data?.features[0]?.properties?.intensity / 50 || 0,
                    "heatmap-opacity": 1,
                    "heatmap-color": heatmapColor,
                    "circle-radius": {
                      property: "dbh",
                      type: "exponential",
                      stops: [
                        [{ zoom: 15, value: data.cellRadius }, 5],
                        [{ zoom: 15, value: data.cellRadius }, 10],
                        [{ zoom: 22, value: data.cellRadius }, 20],
                        [{ zoom: 22, value: data.cellRadius }, 50],
                      ],
                    },
                  }}
                />
              ))}
              {pinsForBound &&
                pinsForBound.map((pin, index) => (
                  <Mapbox.MarkerView
                    key={
                      pin.icon +
                      pin.venue.geo.latitude +
                      pin.venue.geo.longitude
                    }
                    id={index.toString()}
                    coordinate={[
                      pin.venue.geo.longitude,
                      pin.venue.geo.latitude,
                    ]}
                  >
                    <Marker
                      key={index}
                      setSelectedMarker={setSelectedMarker}
                      pin={pin}
                    />
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
                    {selectedTag && (
                      <TouchableOpacity onPress={() => setSelectedTag(null)}>
                        <Tag tag={selectedTag || ""} isActive={true} />
                      </TouchableOpacity>
                    )}
                    {tags &&
                      tags
                        .filter((tag) => selectedTag !== tag)
                        .map((tag, id) => (
                          <TouchableOpacity
                            onPress={() =>
                              setSelectedTag((prev) =>
                                prev === tag ? null : tag
                              )
                            }
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
              <Text style={styles.pointText}>Some point</Text>
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
