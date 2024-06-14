export const dateToShortFormat = (date: Date) => {
  return Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
};
