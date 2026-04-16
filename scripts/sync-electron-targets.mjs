import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { detectElectronEsTarget } from "./electron-chrome-version.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const { esTarget, chromeMajor, nodeMajor, nodeVersion } = detectElectronEsTarget();

const chromeTarget = `chrome${chromeMajor}`;
const nodeTarget = `node${nodeMajor}`;

console.log(`Electron bundled versions: Chrome ${chromeMajor}, Node ${nodeMajor}`);
console.log(`ES target: ${esTarget}`);
console.log(`Vite targets: ${chromeTarget} (renderer), ${nodeTarget} (main/preload)`);

// TypeScript `module` only accepts up to "ES2022"; for higher ES targets use "ESNext".
const moduleTarget = esTarget > "ES2022" ? "ESNext" : esTarget;

/**
 * Update target and module in a tsconfig JSON file.
 * Performs text-level replacement to preserve the original formatting.
 * @param {string} relativePath
 */
function updateTsconfig(relativePath) {
  const filePath = resolve(root, relativePath);
  let text = readFileSync(filePath, "utf-8");
  const json = JSON.parse(text);

  const prevTarget = json.compilerOptions.target;
  const prevModule = json.compilerOptions.module;

  text = text.replace(
    /("target"\s*:\s*)"[^"]*"/,
    `$1"${esTarget}"`,
  );
  text = text.replace(
    /("module"\s*:\s*)"[^"]*"/,
    `$1"${moduleTarget}"`,
  );

  writeFileSync(filePath, text);
  console.log(
    `  ${relativePath}: target ${prevTarget} -> ${esTarget}, module ${prevModule} -> ${moduleTarget}`,
  );
}

/**
 * Update the build target in a vite.config.ts file.
 * Matches the pattern: target: '...' or target: "..."
 * @param {string} relativePath
 * @param {string} newTarget
 */
function updateViteConfig(relativePath, newTarget) {
  const filePath = resolve(root, relativePath);
  let text = readFileSync(filePath, "utf-8");

  const match = text.match(/target:\s*(['"])([^'"]*)\1/);
  const prev = match ? match[2] : "unknown";

  text = text.replace(
    /target:\s*(['"])[^'"]*\1/,
    `target: $1${newTarget}$1`,
  );

  writeFileSync(filePath, text);
  console.log(`  ${relativePath}: ${prev} -> ${newTarget}`);
}

/**
 * Update the Node.js version in .mise.toml.
 * @param {string} newVersion - Full version string (e.g. "24.14.1")
 */
function updateMiseToml(newVersion) {
  const filePath = resolve(root, ".mise.toml");
  let text = readFileSync(filePath, "utf-8");

  const match = text.match(/^node\s*=\s*"([^"]*)"/m);
  const prev = match ? match[1] : "unknown";

  text = text.replace(
    /^(node\s*=\s*")[^"]*(")/m,
    `$1${newVersion}$2`,
  );

  writeFileSync(filePath, text);
  console.log(`  node: ${prev} -> ${newVersion}`);
}

console.log("\ntsconfig:");
updateTsconfig("tsconfig.node.json");
updateTsconfig("tsconfig.web.json");

console.log("\nvite.config.ts:");
updateViteConfig("src/main/vite.config.ts", nodeTarget);
updateViteConfig("src/preload/vite.config.ts", nodeTarget);
updateViteConfig("src/renderer/vite.config.ts", chromeTarget);

console.log("\n.mise.toml:");
updateMiseToml(nodeVersion);

console.log("\nDone.");
console.log(
  "\nNote: If the Node.js major version changed, run `mise install` to install the new version.",
);
