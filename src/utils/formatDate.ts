export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  if (date < now) {
    return "Event has already expired";
  }

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  if (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  ) {
    // Format time
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    return `Tomorrow at ${formattedHours}:${formattedMinutes} ${ampm}`;
  } else {
    // Check if the event is happening now
    if (date <= now && now <= new Date(date.getTime() + 3600 * 1000)) {
      return "Happening now";
    } else {
      if (date > now) {
        const formattedDate = `${date.getDate()}.${
          date.getMonth() + 1
        }.${date.getFullYear()}`;
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "pm" : "am";
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

        return `${formattedDate} at ${formattedHours}:${formattedMinutes} ${ampm}`;
      } else {
        return dateString;
      }
    }
  }
}
