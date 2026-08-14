import path from "node:path";
import { fileURLToPath } from "node:url";
import { app, BrowserWindow } from "electron";

/** Package name from package.json, injected at build time via Vite `define`. */
declare const __APP_PACKAGE_NAME__: string;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// In development the app runs from the shared Electron binary, so userData
// would default to the generic "Electron" directory. Redirect it to a
// package-name-specific directory to keep dev data isolated per project.
// Packaged apps (electron-builder) already get their own directory from
// productName, so leave them untouched.
if (!app.isPackaged) {
  app.setPath(
    "userData",
    path.join(app.getPath("appData"), __APP_PACKAGE_NAME__),
  );
}

// This app does not use safeStorage, so prevent Chromium's cookie encryption
// from accessing the OS credential store and showing a permission dialog on
// startup. `use-mock-keychain` covers macOS (the `password-store` switch is
// Linux-only and has no effect there), while `password-store=basic` avoids the
// libsecret/kwallet backends on Linux.
app.commandLine.appendSwitch("use-mock-keychain");
app.commandLine.appendSwitch("password-store", "basic");

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  app.quit();
});
