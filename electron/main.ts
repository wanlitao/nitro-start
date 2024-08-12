import { app, BrowserWindow, ipcMain } from "electron"
import path from 'node:path'

process.env.APP_ROOT = path.join(__dirname, "..");

export const RENDERER_DIST = path.join(process.env.APP_ROOT, ".output/public");

function createWindow() {
  let win = new BrowserWindow({
    webPreferences: {}
  });

  win.loadURL(process.env.NITRO_LISTEN_URL);

  if (process.env.NODE_ENV === "development") {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
