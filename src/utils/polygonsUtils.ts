export const getH3ResolutionByZoom = (zoom: number) => {
  if (zoom < 2) return 1;
  if (zoom < 4) return 1;
  if (zoom < 5) return 1;
  if (zoom < 6) return 2;
  if (zoom < 7) return 3;
  if (zoom < 8) return 5;
  if (zoom < 9) return 5;
  if (zoom < 10) return 5;
  if (zoom < 11) return 6;
  if (zoom < 12) return 7;
  if (zoom < 14) return 8;
  if (zoom < 16) return 9;
  return 9;
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
