import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as url from "url";
import * as fs from "fs";

const isDevelopment = process.env.NODE_ENV === "development";

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require("electron-squirrel-startup")) {
  app.quit();
}

let mainWindow: BrowserWindow | null = null;

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
