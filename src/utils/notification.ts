import {
  LocalNotifications,
  ScheduleOptions,
} from "@capacitor/local-notifications";
export const showLocalNotifications = (
  title: string,
  body: string,
  summary: string
) => {
  const options: ScheduleOptions = {
    notifications: [
      {
        id: 1,
        title: title,
        body: body,
        summaryText: summary,
      },
    ],
  };
  try {
    LocalNotifications.schedule(options);
  } catch (error) {
    console.log("Notification error:", error);
  }
};
