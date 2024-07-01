export const PIN = {
  MAX_SIZE: 30,
  MIN_SIZE: 25,
};

export const HITBOX = { width: 10, height: 10 };
export const PIN_SYMBOL_LAYER_STYLE = {
  iconImage: ["get", "icon"],
  iconSize: ["get", "iconSize"],
  symbolSortKey: ["to-number", ["get", "priority"]],
  symbolZOrder: "auto",
  iconAllowOverlap: true,

  iconOffset: ["get", "iconOffset"],
};
