export const getIconUrl = (id: string, isMaxQuality = false) => {
  const parsedIconId = id.replace("id:", "");
  return `https://app-vibecustomiconsapi-dev.azurewebsites.net/icons/download?id=${parsedIconId}&width=64&height=64`;
};
