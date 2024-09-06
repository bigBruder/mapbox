export const getH3ResolutionByZoom = (zoom: number) => {
  // console.log("zoom", zoom);
  switch (true) {
    case zoom >= 0 && zoom <= 3:
      return 1;
    case zoom > 3 && zoom <= 5:
      return 2;
    case zoom > 5 && zoom <= 7:
      return 3;
    case zoom > 7 && zoom <= 8:
      return 4;
    case zoom >= 7 && zoom <= 9:
      return 5;
    case zoom >= 9 && zoom <= 10:
      return 6;
    case zoom >= 11 && zoom <= 12:
      return 7;
    case zoom >= 13 && zoom <= 14:
      return 8;
    case zoom >= 15 && zoom <= 16:
      return 9;
    case zoom >= 17 && zoom <= 18:
      return 9;
    default:
      return 1;
  }
};

export const addBufferToCoordinates = (
  nw: number[],
  se: number[],
  buffer: number
) => {
  const latDiff = Math.abs(nw[0] - se[0]);
  const lngDiff = Math.abs(nw[1] - se[1]);

  const adjustLat = (lat: number) => Math.max(Math.min(lat, 90), -90);
  const adjustLng = (lng: number) => {
    if (lng > 180) return lng - 360;
    if (lng < -180) return lng + 360;
    return lng;
  };

  return [
    [adjustLat(nw[0] + latDiff * buffer), adjustLng(nw[1] - lngDiff * buffer)], // NW
    [adjustLat(nw[0] + latDiff * buffer), adjustLng(se[1] + lngDiff * buffer)], // NE
    [adjustLat(se[0] - latDiff * buffer), adjustLng(se[1] + lngDiff * buffer)], // SE
    [adjustLat(se[0] - latDiff * buffer), adjustLng(nw[1] - lngDiff * buffer)], // SW
    [adjustLat(nw[0] + latDiff * buffer), adjustLng(nw[1] - lngDiff * buffer)],
  ];
};
