export function transformDataToHeatmap(data) {
  const heatmapData = [
    {
      type: "FeatureCollection",
      features: [],
    },
  ];

  const { cellRadius, data: coordinates, resolution } = data;

  for (const coord in coordinates) {
    if (coordinates.hasOwnProperty(coord)) {
      const [lng, lat] = coord.split(",").map(parseFloat);
      const intensity = coordinates[coord];
      heatmapData[0].features.push({
        type: "Feature",
        properties: {
          intensity: intensity,
        },
        geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
      });
    }
  }

  return heatmapData;
}
