import { app, BrowserWindow, ipcMain, utilityProcess } from "electron";
import { ConfigureMessageBoxHandler } from "./handlers/messagebox";
import { ConfigureNotificationHandler } from "./handlers/notification";
import { ConfigureUpdater } from "./autoupdate/updater";
import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";

process.env.APP_ROOT = path.join(__dirname, "../..");

const is_development = process.env.NODE_ENV === "development";
if (!is_development) {
  dotenv.config({ path: path.join(process.env.APP_ROOT, ".env.production") });
}

let nitro_server_process;
let is_update_downloaded = false; // 是否更新已下载完成

function createWindow() {
  let win = new BrowserWindow({
    width: 1280,
    height: 960,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (is_development) {
    win.loadURL(process.env.NITRO_SWAGGER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadURL(process.env.NITRO_LISTEN_URL);
  }

  injectUpdaterHandlerJs(win); // 注入自动更新处理代码

  return win;
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

function startBackgroundNitroServer() {
  const nitro_dist = path.join(process.env.APP_ROOT, "dist/backend");
  const nitro_server_indexjs = path.join(nitro_dist, "server/index.mjs");

  nitro_server_process = utilityProcess.fork(nitro_server_indexjs);
}

function resolveBackgroundNitroListenUrl() {
  const nitro_host = process.env.NITRO_HOST || "localhost";
  const nitro_port = process.env.NITRO_PORT || 3000;

  process.env.NITRO_LISTEN_URL = `http://${nitro_host}:${nitro_port}/`;
}

app.whenReady().then(() => {
  if (!is_development) {
    startBackgroundNitroServer();

    resolveBackgroundNitroListenUrl();
  }

  ConfigureMessageBoxHandler();
  ConfigureNotificationHandler();

  createWindow();
  ConfigureUpdater();

  ipcMain.on("update-downloaded", () => {
    is_update_downloaded = true;
  });

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("before-quit", () => {
  if (nitro_server_process) {
    nitro_server_process.kill();
    nitro_server_process = null;
  }
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
