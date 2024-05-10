export function transformDataToHeatmap(data) {
  const cellRadius = data["cellRadius"];
  // console.log("data ====> ", cellRadius);
  const heatmapData = [
    {
      type: "FeatureCollection",
      features: [],
      resolution: data["resolution"],
      cellRadius: cellRadius,
    },
  ];

  const { data: coordinates, resolution } = data;

  for (const coord in coordinates) {
    if (coordinates.hasOwnProperty(coord)) {
      const [lng, lat] = coord.split(",").map(parseFloat);
      const intensity = coordinates[coord];
      heatmapData[0].features.push({
        type: "Feature",
        properties: {
          intensity: intensity,
          cellRadius: cellRadius,
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
