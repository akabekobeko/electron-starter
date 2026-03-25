# electron-starter

A template project for developing new Electron applications.

## Scripts

| Script | Description |
| --- | --- |
| `dev` | Start the development server |
| `build` | Build all processes (main, preload, renderer) |
| `typecheck` | Run TypeScript type checking |
| `package` | Build and package the app with electron-builder |
| `sync-targets` | Sync tsconfig targets with the installed Electron version |

## Updating Electron

After upgrading the Electron version in `package.json`:

```sh
pnpm install
pnpm run sync-targets
```

`sync-targets` detects the Chrome and Node.js versions bundled with the installed Electron, then updates `tsconfig.node.json` and `tsconfig.web.json` (`target` / `module`) accordingly.

Vite build targets for each process are resolved dynamically at build time and require no manual update:

- **renderer** — `chrome{major}` via `getElectronChromeTarget()`
- **main / preload** — `node{major}` via `getElectronNodeTarget()`
