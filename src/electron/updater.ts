import { autoUpdater } from "electron-updater";
import { BrowserWindow, ipcMain } from "electron";

export const ConfigureUpdater = (win: BrowserWindow) => {
  let mainWin = win;
  
  // 关闭自动更新
  autoUpdater.autoDownload = false;
  // 开发环境下 启用自动更新
  autoUpdater.forceDevUpdateConfig = true;

  autoUpdater.on("checking-for-update", () => {
    mainWin.webContents.send("updater-checking");
  });
  autoUpdater.on("update-available", (info) => {
    mainWin.webContents.send("updater-available", info);
  });
  autoUpdater.on("update-not-available", (info) => {
    mainWin.webContents.send("updater-not-available", info);
  });
  autoUpdater.on("error", (err, msg) => {
    mainWin.webContents.send("updater-error", err);
  });
  autoUpdater.on("download-progress", (progressInfo) => {
    mainWin.webContents.send("updater-download-progress", progressInfo);
  });
  autoUpdater.on("update-downloaded", (event) => {
    mainWin.webContents.send("updater-downloaded", event);
    // 响应-更新app
    ipcMain.on("update-app", (e, args) => {
      autoUpdater.quitAndInstall();
    });
  });

  // 响应-检查更新
  ipcMain.on("check-update", (e, args) => {
    autoUpdater.checkForUpdates();
  });

  // 响应-确认更新
  ipcMain.on("comfirm-update", (e, args) => {
    autoUpdater.downloadUpdate();
  });
};
