import { ipcMain, dialog } from "electron";

export const configureMessageBoxHandler = () => {
  ipcMain.handle("show-messagebox", (e, options) => {
    return dialog.showMessageBoxSync(options);
  });
};
