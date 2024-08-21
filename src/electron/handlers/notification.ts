import { ipcMain, Notification } from "electron";

export const ConfigureNotificationHandler = () => {
  ipcMain.on("show-notification", (e, options) => {
    new Notification(options).show();
  });
};
