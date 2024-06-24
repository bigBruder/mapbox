import { FC } from "react";
import { ShapeSource, SymbolLayer } from "@rnmapbox/maps";
import { VibesItem } from "@/types/SearchResponse";
import { HITBOX, PIN_SYMBOL_LAYER_STYLE } from "@/constants/pin";
import { getFrameId } from "@/helpers/helpers";

interface Props {
  pins: VibesItem[];
  setSelectedMarker: (pin: any) => void;
  selectedMarker: any;
  realtimeZoom: number;
}

export const MarkerList: FC<Props> = ({
  pins,
  setSelectedMarker,
  selectedMarker,
}) => {
  const pinsToDisplay = pins.map((pin, index) => {
    const isSelected = selectedMarker?.id === pin.id;
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [pin.venue.geo.longitude, pin.venue.geo.latitude],
      },
      properties: {
        priority: isSelected ? 1000 : index,
        icon: pin.icon.replace("id:", ""),
        iconSize: 0.3 + pin.points / 100,
      },
      id: pin.id,
    };
  });

  const pinFrames = pins.map((pin, index) => {
    const isAlreadyStarted = new Date() > new Date(pin.startsAt);
    const isSelected = selectedMarker?.id === pin.id;

    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [pin.venue.geo.longitude, pin.venue.geo.latitude],
      },
      properties: {
        // ...pin,
        priority: isSelected ? 1000 : index,
        icon: getFrameId(isAlreadyStarted, isSelected),
        iconSize: 0.7,
        textField: ["get", "icon"],
        textCustomColor: "#FFFFFF",
      },
      style: {
        padding: 10,
      },
      id: pin.id,
    };
  });

  const shape = {
    type: "FeatureCollection",
    features: [...pinsToDisplay, ...pinFrames],
  };

  return (
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
    >
      <SymbolLayer
        id={"freshPins_usual"}
        layerIndex={85}
        style={PIN_SYMBOL_LAYER_STYLE}
      />
    </ShapeSource>
  );
};
