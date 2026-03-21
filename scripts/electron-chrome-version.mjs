import { execFileSync } from "node:child_process";
import electron from "electron";

/**
 * Get the Chrome major version bundled with the installed Electron.
 * Runs `electron -e "..."` to query `process.versions.chrome`.
 * @returns {string} e.g. "chrome146"
 */
export function getElectronChromeTarget() {
  const version = execFileSync(
    String(electron),
    ["-e", "process.stdout.write(process.versions.chrome)"],
    {
      encoding: "utf-8",
      timeout: 10_000,
      env: { ...process.env, ELECTRON_RUN_AS_NODE: "1" },
    },
  ).trim();

  const major = version.split(".")[0];
  return `chrome${major}`;
}
