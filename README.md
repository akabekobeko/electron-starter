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
mise install
```

`sync-targets` detects the Chrome and Node.js versions bundled with the installed Electron, then updates the following files:

- `tsconfig.node.json` / `tsconfig.web.json` — `target` and `module`
- `src/main/vite.config.ts` / `src/preload/vite.config.ts` — `build.target` (`node{major}`)
- `src/renderer/vite.config.ts` — `build.target` (`chrome{major}`)
- `.mise.toml` — `node` version (matching the bundled Node.js version)

If the Node.js major version changed, `mise install` installs the new version.
