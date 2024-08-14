import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fork } from "node:child_process";

process.env.APP_ROOT = path.join(__dirname, "../..");
const nitro_dist = path.join(process.env.APP_ROOT, "dist/backend");

const isDevelopment = process.env.NODE_ENV === "development";

function createWindow() {
  let win = new BrowserWindow({
    width: 1280,
    height: 960,
    webPreferences: {},
  });

  if (isDevelopment) {
    win.loadURL(process.env.NITRO_SWAGGER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadURL(process.env.NITRO_LISTEN_URL);
  }
}

function startNitroServer() {
  const nitroServerIndexJs = path.join(nitro_dist, "server/index.mjs");  

  let nitroServerProcess = fork(nitroServerIndexJs, {
    stdio: "inherit",
    env: process.env
  });
}

function resolveNitroListenUrl() {
  const listenHost = process.env.HOST || "localhost";
  const listenPort = process.env.PORT || 3000;

  process.env.NITRO_LISTEN_URL = `http://${listenHost}:${listenPort}/`;
}

app.whenReady().then(() => {
  if (!isDevelopment) {
    startNitroServer();
    
    resolveNitroListenUrl();
  }

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
