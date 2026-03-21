import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { getElectronChromeTarget } from "../../scripts/electron-chrome-version.mjs";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default defineConfig({
  root: __dirname,
  plugins: [react(), tailwindcss()],
  base: "./",
  build: {
    // Automatically selects the Chrome version that matches the adopted Electron
    target: getElectronChromeTarget(),
    outDir: "../../dist/renderer",
    emptyOutDir: true,
  },
});
