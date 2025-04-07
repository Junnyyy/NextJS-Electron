import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as url from "url";
import * as fs from "fs";
import squirrelStartup from "electron-squirrel-startup";

const isDevelopment = process.env.NODE_ENV === "development";

if (squirrelStartup) {
  app.quit();
}

let mainWindow: BrowserWindow | null = null;

// setup IPC handlers
const setupIpcHandlers = () => {
  ipcMain.on("example-message", (event, data) => {
    console.log("Received message from renderer:", data);

    event.reply("example-response", {
      received: true,
      timestamp: new Date().toISOString(),
      message: "Message received in main process!",
    });
  });

  ipcMain.handle("get-system-info", () => {
    return {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      electronVersion: process.versions.electron,
      chromeVersion: process.versions.chrome,
    };
  });
};

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  setupIpcHandlers();

  let nextAppUrl: string;

  if (isDevelopment) {
    // Dev server URL
    nextAppUrl = "http://localhost:3000";
  } else {
    // In production, load from the local file system
    const indexPath = path.join(__dirname, "../out/index.html");

    if (fs.existsSync(indexPath)) {
      nextAppUrl = url.format({
        pathname: indexPath,
        protocol: "file:",
        slashes: true,
      });
    } else {
      const altPath = path.join(process.resourcesPath, "out/index.html");
      if (fs.existsSync(altPath)) {
        nextAppUrl = url.format({
          pathname: altPath,
          protocol: "file:",
          slashes: true,
        });
      } else {
        console.error(
          `Error: Could not find index.html at ${indexPath} or ${altPath}`
        );
        app.quit();
        return;
      }
    }
  }

  try {
    await mainWindow.loadURL(nextAppUrl);
  } catch (err) {
    console.error("Failed to load URL:", err);
  }

  // Open DevTools in development
  if (isDevelopment) {
    mainWindow.webContents.openDevTools();
  }
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
