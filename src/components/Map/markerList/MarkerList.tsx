import { FC } from "react";
import { MarkerView } from "@rnmapbox/maps";
import { Marker } from "../../marker/Marker";
import { VibesItem } from "../../../types/searchResponse";

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
  realtimeZoom,
}) => {
  return pins.map((pin, index) => {
    const longitude = pin.venue.geo.longitude;
    const latitude = pin.venue.geo.latitude;

    return (
      <MarkerView
        key={index}
        id={index.toString()}
        coordinate={[longitude, latitude]}
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
          pin={pin}
          setSelectedMarker={setSelectedMarker}
          zoom={realtimeZoom}
          isSelected={selectedMarker?.id === pin.id}
        />
      </MarkerView>
    );
  });
};
