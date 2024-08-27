import * as Notifications from "expo-notifications";

export const scheduleNotification = async (
  triggerTime: {
    seconds: number;
  },
  id: string
) => {
  try {
    console.log("Requesting notification schedule");
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Go Pulse",
        body: "Your pulse has expired. You can renew it!",
        data: {
          id: id,
          data: "goes here",
          test: { test1: "more data" },
          url: "Pulse",
        },
      },
      trigger: triggerTime,
    });

    // navigation.navigate("Pulse", { screen: "Pulse" });
    console.log("Notification scheduled successfully");
  } catch (error) {
    console.error("Failed to schedule notification:", error);
  }
};
