import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronIpc", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...eventArgs) =>
      listener(event, ...eventArgs)
    );
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },
  checkUpdate(...args: any[]) {
    return ipcRenderer.send("check-update", ...args);
  },
  confirmUpdate(...args: any[]) {
    return ipcRenderer.send("comfirm-update", ...args);
  },
  updateApp(...args: any[]) {
    return ipcRenderer.send("update-app", ...args);
  }
});
