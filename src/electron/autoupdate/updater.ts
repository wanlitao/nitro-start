import { autoUpdater } from "electron-updater";
import { BrowserWindow, ipcMain } from "electron";

// 发送消息到焦点Window
const SendMessageToFocusWindow = (channel: string, ...args: any[]) =>
  BrowserWindow.getFocusedWindow()?.webContents.send(channel, ...args);

export const ConfigureUpdater = () => {
  // 关闭自动更新
  autoUpdater.autoDownload = false;
  // 开发环境下 启用自动更新
  autoUpdater.forceDevUpdateConfig = true;

  autoUpdater.on("checking-for-update", () => {
    SendMessageToFocusWindow("updater-checking");
  });
  autoUpdater.on("update-available", (info) => {
    SendMessageToFocusWindow("updater-available", info);
  });
  autoUpdater.on("update-not-available", (info) => {
    SendMessageToFocusWindow("updater-not-available", info);
  });
  autoUpdater.on("error", (err, msg) => {
    SendMessageToFocusWindow("updater-error", err, msg);
  });
  autoUpdater.on("download-progress", (progressInfo) => {
    SendMessageToFocusWindow("updater-download-progress", progressInfo);
  });
  autoUpdater.on("update-downloaded", (event) => {
    ipcMain.emit("update-downloaded"); // 标记更新已下载完成

    SendMessageToFocusWindow("updater-downloaded", event);

    // 响应-安装更新
    ipcMain.on("install-update", (e, ...args) => {
      autoUpdater.quitAndInstall();
    });
  });

  // 响应-检查更新
  ipcMain.on("check-update", (e, ...args) => {
    autoUpdater.checkForUpdates();
  });

  // 响应-下载更新
  ipcMain.on("download-update", (e, ...args) => {
    autoUpdater.downloadUpdate();
  });
};
