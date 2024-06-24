export const getFrameId = (isAlreadyStarted: boolean, isSelected: boolean) => {
  if (!isAlreadyStarted && !isSelected) return "frame";
  if (isAlreadyStarted && !isSelected) return "frameStarted";
  if (!isSelected && isSelected) return "frameSelected";
  if (isAlreadyStarted && isSelected) return "frameSelectedStarted";
  return "frame";
};
