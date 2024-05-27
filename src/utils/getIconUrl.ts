export const getIconUrl = (id: string, isMaxQuality = false) => {
  return `https://app-vibecustomiconsapi-dev.azurewebsites.net/icons/download?id=${id}&width=${
    isMaxQuality ? 100 : 50
  }`;
};
