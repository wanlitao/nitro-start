import { app, BrowserWindow, ipcMain } from "electron";
import { ConfigureUpdater } from "./updater";
import dotenv from "dotenv";
import path from "node:path";
import { fork } from "node:child_process";

process.env.APP_ROOT = path.join(__dirname, "../..");

const is_development = process.env.NODE_ENV === "development";
if (!is_development) {
  dotenv.config({ path: path.join(process.env.APP_ROOT, ".env.production") });
}

let nitro_server_process;

function createWindow() {
  let win = new BrowserWindow({
    width: 1280,
    height: 960,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  if (is_development) {
    win.loadURL(process.env.NITRO_SWAGGER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadURL(process.env.NITRO_LISTEN_URL);
  }

  return win;
}

function startBackgroundNitroServer() {
  const nitro_dist = path.join(process.env.APP_ROOT, "dist/backend");
  const nitro_server_indexjs = path.join(nitro_dist, "server/index.mjs");

  nitro_server_process = fork(nitro_server_indexjs, { stdio: "inherit" });
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

  let mainWin = createWindow();

  ConfigureUpdater(mainWin);
});

app.on("before-quit", () => {
  if (nitro_server_process) {
    nitro_server_process.kill();
    nitro_server_process = null;
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
