import { FC } from "react";
import { Images, ShapeSource, SymbolLayer } from "@rnmapbox/maps";
import { VibesItem } from "@/types/SearchResponse";
import { HITBOX, PIN_SYMBOL_LAYER_STYLE } from "@/constants/pin";
import { getFrameId } from "@/helpers/helpers";
import { transformPinsToImagesForMap } from "@/utils/helpersFunctions";
import { useMapStore } from "@/store/MapStore";

interface Props {
  pins: VibesItem[];
  setSelectedMarker: (pin: any) => void;
  selectedMarker: any;
  realtimeZoom: number;
}

const ICON_OFFSET_Y = 0;
const ICON_OFFSET_Y_SELECTED = -45;
const FRAME_OFFSET_Y = 0;
const FRAME_OFFSET_Y_SELECTED = -24;

export const MarkerList: FC<Props> = ({
  pins,
  setSelectedMarker,
  selectedMarker,
}) => {
  const getAllVibes = useMapStore((state) => state.getAllVibes);
  const pinsToDisplay = pins.map((pin, index) => {
    const isSelected = selectedMarker?.id === pin.id;
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [pin.venue.geo.longitude, pin.venue.geo.latitude],
      },
      properties: {
        priority: isSelected ? 1001 : (pins.length - index) * 10 + 1,
        icon: pin.icon.replace("id:", ""),
        iconSize: 0.2 + pin.points / 100,
        iconOffset: [0, isSelected ? ICON_OFFSET_Y_SELECTED : ICON_OFFSET_Y],
        allowOverlap: true,
      },
      id: pin.id,
    };
  });

  const pinFrames = pins.map((pin, index) => {
    const isAlreadyStarted = new Date() > new Date(pin.startsAt);
    const isSelected = selectedMarker?.id === pin.id;
    const { longitude, latitude } = pin.venue.geo;

    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      properties: {
        priority: isSelected ? 1000 : (pins.length - index) * 10,
        icon: getFrameId(isAlreadyStarted, isSelected),
        iconSize: (0.3 + pin.points / 100) * 1.6,
        iconOffset: [0, isSelected ? FRAME_OFFSET_Y_SELECTED : FRAME_OFFSET_Y],
        allowOverlap: true,
      },
      id: pin.id,
    };
  });

  const shape = {
    type: "FeatureCollection",
    features: [...pinFrames, ...pinsToDisplay], // Переконайтеся, що фрейми рендеряться нижче іконок
  };

  // const pinsImages = transformPinsToImagesForMap(getAllVibes());

  return (
    <>
      {/* <Images
        images={{ ...pinsImages }}
        onImageMissing={(e) => {
          console.log("Image missing: ", e);
        }}
      /> */}
      <ShapeSource
        id="freshPins_usual"
        onPress={(e) => {
          if (e.features[0].id === selectedMarker?.id) setSelectedMarker(null);
          setSelectedMarker(
            pins.find((pin) => pin.id === e.features[0].id) || null
          );
        }}
        //@ts-ignore
        shape={shape}
        hitbox={HITBOX}
        cluster={false}
        minZoomLevel={0}
        maxZoomLevel={24}
      >
        <SymbolLayer
          id={"freshPins_usual"}
          layerIndex={85}
          style={PIN_SYMBOL_LAYER_STYLE}
        />
      </ShapeSource>
    </>
  );
};
