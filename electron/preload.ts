import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  sendMessage: <T>(channel: string, args: T) => {
    ipcRenderer.send(channel, args);
  },
  on: <T>(channel: string, callback: (...args: T[]) => void) => {
    const subscription = (_event: Electron.IpcRendererEvent, ...args: T[]) =>
      callback(...args);
    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
});
