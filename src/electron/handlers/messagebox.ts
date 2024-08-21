import { ipcMain, dialog } from "electron";

export const ConfigureMessageBoxHandler = () => {
  ipcMain.handle("show-messagebox", (e, options) => {
    return dialog.showMessageBoxSync(options);
  });
};
