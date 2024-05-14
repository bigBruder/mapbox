export const TransformToIsoDate = (
  date: string
): {
  before: string;
  after: string;
} => {
  let beforeDate = new Date(),
    afterDate = new Date();

  switch (date) {
    case "Now":
      afterDate = new Date();
      beforeDate = new Date();
      break;
    case "Today":
      beforeDate.setDate(beforeDate.getDate() + 1);
      break;
    case "Tomorrow":
      // Set time to the start of the next day
      beforeDate.setDate(beforeDate.getDate() + 1);
      beforeDate.setHours(0, 0, 0, 0);

      // Set time to the end of the next day
      afterDate.setDate(afterDate.getDate() + 2); // Next day
      afterDate.setHours(23, 59, 59, 999); // End of the day
      break;
    case "Next Week":
      // Set time to the start of the next week
      beforeDate.setDate(beforeDate.getDate() + (8 - beforeDate.getDay())); // Move to the next Sunday (start of the week)
      beforeDate.setHours(0, 0, 0, 0);

      // Set time to the end of the next week
      afterDate.setDate(afterDate.getDate() + (14 - afterDate.getDay())); // Move to the next Saturday (end of the week)
      afterDate.setHours(23, 59, 59, 999);
    case "Next Month":
      // Set time to the start of the next month
      beforeDate.setMonth(beforeDate.getMonth() + 1);
      beforeDate.setDate(1);
      beforeDate.setHours(0, 0, 0, 0);

      // Set time to the end of the next month
      afterDate.setMonth(afterDate.getMonth() + 2);
      afterDate.setDate(0); // Set to the last day of the next month
      afterDate.setHours(23, 59, 59, 999);
      break;
    default:
      beforeDate = new Date();
      afterDate = new Date();
      break;
  }

  return {
    before: beforeDate?.toISOString().split("T")[0] + "Z",
    after: afterDate.toISOString().split("T")[0] + "Z",
  };
};

// Don't use custom date range for now
