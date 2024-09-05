import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";

export const scheduleNotification = async (
  triggerTime: {
    seconds: number;
  },
  id: string
) => {
  try {
    // console.log("Requesting notification schedule");
    const notification = await Notifications.scheduleNotificationAsync({
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
    // console.log("Scheduled notification:", notification);

    saveNotificationId(id, notification);

    // navigation.navigate("Pulse", {
    //   state: {
    //     itemId: id,
    //   },
    // });
    // console.log("Notification scheduled successfully");
  } catch (error) {
    console.error("Failed to schedule notification:", error);
  }
};

export const cancelNotification = async (topicId: string) => {
  try {
    const storedData = await AsyncStorage.getItem("notifications");
    const notifications = storedData ? JSON.parse(storedData) : {};
    const notificationId = notifications[topicId];
    if (!notificationId) {
      return;
    }
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error("Failed to cancel notification:", error);
  }
};

const saveNotificationId = async (topicId: string, notificationId: string) => {
  try {
    const storedData = await AsyncStorage.getItem("notifications");
    const notifications = storedData ? JSON.parse(storedData) : {};

    notifications[topicId] = notificationId;

    await AsyncStorage.setItem("notifications", JSON.stringify(notifications));
  } catch (error) {
    console.error("Failed to save notification ID:", error);
  }
};

export const cleanUpExpiredNotifications = async () => {
  try {
    const storedData = await AsyncStorage.getItem("notifications");
    const notifications = storedData ? JSON.parse(storedData) : {};

    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();
    const scheduledNotificationIds = scheduledNotifications.map(
      (notification) => notification.identifier
    );

    const updatedNotifications = Object.fromEntries(
      Object.entries(notifications).filter(([topicId, notificationId]) =>
        scheduledNotificationIds.includes(notificationId)
      )
    );

    await AsyncStorage.setItem(
      "notifications",
      JSON.stringify(updatedNotifications)
    );

    console.log("Expired notifications cleaned up successfully");
  } catch (error) {
    console.error("Failed to clean up expired notifications:", error);
  }
};
