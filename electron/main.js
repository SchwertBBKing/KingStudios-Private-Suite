const { app, BrowserWindow } = require("electron");
const path = require("path");

async function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: "#0b0b0f",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // In dev, prefer the Vite dev server so modules and HMR work.
  const devUrl = "http://localhost:5173";
  try {
    await win.loadURL(devUrl);
    console.log("Loaded dev server:", devUrl);
  } catch (err) {
    // Fallback to the static file (production build / packaged app)
    console.log("Dev server not available, loading local file:", err.message);
    win.loadFile("../index.html");
  }
}

app.whenReady().then(createWindow);
