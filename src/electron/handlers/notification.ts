import { app, ipcMain, Notification } from "electron";

export const ConfigureNotificationHandler = () => {
  // Windows特殊设置, 保证Notification通知 标题栏显示appName
  if (process.platform === "win32") {
    app.setAppUserModelId(app.name);
  }

  ipcMain.on("show-notification", (e, options) => {
    new Notification(options).show();
  });
};
