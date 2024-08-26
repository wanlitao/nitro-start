import { app, BrowserWindow, ipcMain, dialog } from "electron";
import { isDevelopment, isProduction } from "./utils/env";
import { startBackgroundNitroServer } from "./helpers/start-nitro-server";
import { configureMessageBoxHandler } from "./handlers/messagebox";
import { configureNotificationHandler } from "./handlers/notification";
import { configureUpdater } from "./autoupdate/updater";
import path from "node:path";
import fs from "node:fs";

let mainWindow;
let is_update_downloaded = false; // 是否更新已下载完成

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 960,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDevelopment) {
    mainWindow.loadURL(process.env.NITRO_SWAGGER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(process.env.NITRO_LISTEN_URL);
  }

  injectUpdaterHandlerJs(mainWindow); // 注入自动更新处理代码
}

function injectUpdaterHandlerJs(win: BrowserWindow) {
  win.webContents.on("did-finish-load", () => {
    const injectUpdaterHandlerJsCode = fs
      .readFileSync(
        path.join(__dirname, "autoupdate/inject-updater-handler.js")
      )
      .toString();
    win.webContents.executeJavaScript(injectUpdaterHandlerJsCode);
  });
}

// 设置 对应协议启动应用（开发模式调试）
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("nitro-electron", process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient("nitro-electron");
}

// 单实例锁定
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  // win url唤醒 处理
  app.on("second-instance", (event, commandLineArgs, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      mainWindow.isMinimized() && mainWindow.restore();
      mainWindow.focus();
    }

    dialog.showErrorBox(
      "Welcome Back",
      `You arrived from: ${commandLineArgs.pop().slice(0, -1)}`
    );
  });

  // mac url唤醒 处理
  app.on("open-url", (event, url) => {
    dialog.showErrorBox("Welcome Back", `You arrived from: ${url}`);
  });
}

app.whenReady().then(() => {
  if (isProduction) {
    startBackgroundNitroServer();
  }

  configureMessageBoxHandler();
  configureNotificationHandler();

  createWindow();
  configureUpdater();

  ipcMain.on("update-downloaded", () => {
    is_update_downloaded = true;
  });

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (is_update_downloaded) {
      ipcMain.emit("install-update");
    } else {
      app.quit();
    }
  }
});
