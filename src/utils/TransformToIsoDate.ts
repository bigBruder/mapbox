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

    // console.log("BEFORE DAY _______> ", beforeDate);

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
    case "Next 7 Days":
      beforeDate.setDate(afterDate.getDate() + 7);
      break;
    case "Next Week":
      // Set time to the end of the next week
      afterDate.setHours(0, 0, 0, 0);
      afterDate.setDate(afterDate.getDate() + (8 - afterDate.getDay())); // Next week
      afterDate.setHours(0, 0, 0, 0);

      beforeDate.setDate(afterDate.getDate() + 7); // Next week
      beforeDate.setHours(23, 59, 59, 999); // End of the week

      return {
        before: new Date(beforeDate).toISOString(),
        after: new Date(afterDate).toISOString(),
      };
      break;
    case "Next 14 Days":
      beforeDate.setDate(beforeDate.getDate() + 14);
      break;
    case "Next Month":
      // Set afterDate to the start of the next month
      afterDate.setMonth(beforeDate.getMonth() + 1);
      afterDate.setDate(1);
      afterDate.setHours(0, 0, 0, 0);

      // Set beforeDate to the end of the next month
      beforeDate.setMonth(afterDate.getMonth() + 1);
      beforeDate.setDate(0); // Setting date to 0 will set it to the last day of the previous month
      beforeDate.setHours(23, 59, 59, 999);
      break;

    case "Next 30 Days":
      beforeDate.setDate(beforeDate.getDate() + 30);
      break;
    default:
      beforeDate = new Date();
      afterDate = new Date();
      break;
  }

  // console.log(beforeDate, afterDate);

  return {
    before: beforeDate,
    after: afterDate,
  };
};

// Don't use custom date range for now
