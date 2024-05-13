export const TransformToIsoDate = (
  date: string
): {
  before: string;
  after: string;
} => {
  let beforeDate, afterDate;

  switch (date) {
    case "Now":
      afterDate = new Date();
      beforeDate = new Date();
      break;
    case "Today":
      beforeDate = new Date();
      afterDate = new Date();
      beforeDate.setDate(beforeDate.getDate() + 1);
      break;
    case "Tomorrow":
      beforeDate = new Date();
      afterDate = new Date();
      afterDate.setDate(afterDate.getDate() + 1);
      beforeDate.setDate(beforeDate.getDate() + 2);
      break;
    case "Next Week":
      beforeDate = new Date();
      afterDate = new Date();
      afterDate.setDate(afterDate.getDate() + 7);
      beforeDate.setDate(beforeDate.getDate() + 14);
      break;
    case "Next Month":
      beforeDate = new Date();
      afterDate = new Date();
      beforeDate.setMonth(beforeDate.getMonth() + 2);
      afterDate.setMonth(afterDate.getMonth() + 1);
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
