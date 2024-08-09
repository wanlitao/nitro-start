import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";

process.env.APP_ROOT = path.join(__dirname, "..");

export const RENDERER_DIST = path.join(process.env.APP_ROOT, ".output/public");

function createWindow() {
  let win = new BrowserWindow({
    webPreferences: {}
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(process.env.VITE_PUBLIC!, "index.html"));
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
