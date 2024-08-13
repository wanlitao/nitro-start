import { app, BrowserWindow, ipcMain } from "electron"
import path from 'node:path'

process.env.APP_ROOT = path.join(__dirname, "../..");

function createWindow() {
  let win = new BrowserWindow({
    width: 1280,
    height: 960,
    webPreferences: {}
  });
    
  if (process.env.NODE_ENV === "development") {
    win.loadURL(process.env.NITRO_SWAGGER_URL);
    win.webContents.openDevTools();
  }
  else {
    win.loadURL(process.env.NITRO_LISTEN_URL);
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
