import { CameraRef } from "@rnmapbox/maps/lib/typescript/src/components/Camera";
import { useEffect } from "react";

const useFlyToLocation = (
  myLocation: {
    latitude: number;
    longitude: number;
    source: string;
  } | null,
  camera: React.MutableRefObject<CameraRef | null>,
  isFirstFlyHappened: boolean,
  setIsFirstFlyHappened: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    if (!myLocation || isFirstFlyHappened) return;

    camera.current?.flyTo([myLocation.longitude, myLocation.latitude], 4000);

    camera.current?.setCamera({
      zoomLevel: 15,
      animationDuration: 2000,
      animationMode: "flyTo",
      centerCoordinate: [myLocation.longitude, myLocation.latitude],
    });

    setIsFirstFlyHappened(true);
  }, [myLocation, camera, isFirstFlyHappened, setIsFirstFlyHappened]);
};

export default useFlyToLocation;
