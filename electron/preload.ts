import { contextBridge, ipcRenderer } from "electron";

interface ExampleResponse {
  received: boolean;
  timestamp: string;
  message: string;
}

interface SystemInfo {
  platform: string;
  arch: string;
  nodeVersion: string;
  electronVersion: string;
  chromeVersion: string;
}

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
  sendExampleMessage: (message: string) => {
    ipcRenderer.send("example-message", {
      message,
      timestamp: new Date().toISOString(),
    });
  },
  onExampleResponse: (callback: (data: ExampleResponse) => void) => {
    const subscription = (
      _event: Electron.IpcRendererEvent,
      data: ExampleResponse
    ) => callback(data);
    ipcRenderer.on("example-response", subscription);

    return () => {
      ipcRenderer.removeListener("example-response", subscription);
    };
  },
  getSystemInfo: (): Promise<SystemInfo> => {
    return ipcRenderer.invoke("get-system-info");
  },
});
