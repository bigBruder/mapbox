export const removeLinkFromString = (message: string) => {
  return message.replace(/(https?:\/\/[^\s]+)/g, "");
};
