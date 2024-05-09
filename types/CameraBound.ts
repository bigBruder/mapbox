type Bounds = {
  ne: [number, number];
  sw: [number, number];
};

type Properties = {
  bounds: Bounds;
  center: [number, number];
  heading: number;
  pitch: number;
  zoom: number;
};

type Gestures = {
  isGestureActive: boolean;
};

export type CameraBound = {
  gestures: Gestures;
  properties: Properties;
  timestamp: number;
};
