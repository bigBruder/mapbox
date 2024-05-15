export function formatDate(startDateString: string, expiredAtString: string) {
  const startDate = new Date(startDateString);
  const expiredAt = new Date(expiredAtString);
  // console.log("startDate === >", startDate);
  // console.log("endDate === >", expiredAtString);
  const now = new Date();
  // console.log("now === >", now);

  // Check if the event has already expired

  if (expiredAt < now) {
    // console.log(
    //   "Event has already expired",
    //   "startDate === >",
    //   startDate,
    //   "endDate === >",
    //   expiredAt
    // );
    return "Event has already expired";
  }

  // Check if the event is happening now
  if (startDate <= now && now <= expiredAt) {
    return "Happening now";
  }

  // Check if the event is tomorrow
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  if (
    startDate.getDate() === tomorrow.getDate() &&
    startDate.getMonth() === tomorrow.getMonth() &&
    startDate.getFullYear() === tomorrow.getFullYear()
  ) {
    // Format time for tomorrow
    const hours = startDate.getHours();
    const minutes = startDate.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    return `Tomorrow at ${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  // Event is in the future, format the date and time
  if (startDate > now) {
    const formattedDate = `${startDate.getDate()}.${
      startDate.getMonth() + 1
    }.${startDate.getFullYear()}`;
    const hours = startDate.getHours();
    const minutes = startDate.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    return `${formattedDate} at ${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  return startDateString;
}
