import { FC } from "react";
import { MarkerView } from "@rnmapbox/maps";
import { Marker } from "../../marker/Marker";

interface Props {
  index: number;
  pin: any;
  setSelectedMarker: (pin: any) => void;
  selectedMarker: any;
  realtimeZoom: number;
}

export const MarkerList: FC<Props> = ({
  index,
  pin,
  setSelectedMarker,
  selectedMarker,
  realtimeZoom,
}) => {
  return (
    <MarkerView
      key={index}
      id={index.toString()}
      coordinate={[pin.venue.geo.longitude, pin.venue.geo.latitude]}
      isSelected={pin.id === selectedMarker?.id}
      allowOverlap={false}
      anchor={{
        x: pin.id === selectedMarker?.id ? 0.5 : 0.5,
        y: pin.id === selectedMarker?.id ? 1 : 0.5,
      }}
      style={{
        transform: [
          {
            translateY: pin.id === selectedMarker?.id ? 15 : 0,
          },
        ],
      }}
    >
      <Marker
        isSelected={pin.id === selectedMarker?.id}
        key={index}
        setSelectedMarker={setSelectedMarker}
        zoom={realtimeZoom}
        pin={pin}
      />
    </MarkerView>
  );
};
