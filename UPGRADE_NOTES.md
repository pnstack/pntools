# Tauri v2 and Vite v5 Upgrade Notes

## Overview
This document summarizes the upgrade from Tauri v1.6 to v2.8 and Vite v4.4 to v5.4.20.

## Version Changes

### Frontend
- **Vite**: v4.4.4 → v5.4.20
- **@vitejs/plugin-react**: v4.0.4 → v4.7.0
- **@vitejs/plugin-react-swc**: v3.3.2 → v3.11.0
- **@tauri-apps/api**: v1.6.0 → v2.8.0
- **@tauri-apps/cli**: v1.6.1 → v2.8.4

### Backend (Rust)
- **tauri**: v1.7.2 → v2.8.5
- **tauri-build**: v1.5.4 → v2.8.5

### New Dependencies
- **dirs**: v5.0 (for home directory access)
- **Multiple Tauri plugins**: All migrated to v2 versions

## Breaking Changes Fixed

### Rust/Backend Changes

1. **Path API Migration**
   - Changed from: `tauri::api::path::home_dir()`
   - Changed to: `dirs::home_dir()`
   - Files affected: `src-tauri/src/db/mod.rs`, `src-tauri/src/modules/python/mod.rs`, `src-tauri/src/modules/node/mod.rs`

2. **Event Handling**
   - Changed from: `app.listen_global()`
   - Changed to: Event handling via app context (temporarily commented out)
   - File: `src-tauri/src/main.rs`

3. **Window API**
   - Changed from: `app.get_window()`
   - Changed to: `app.get_webview_window()`
   - File: `src-tauri/src/main.rs`

4. **RunEvent Import**
   - Now part of: `tauri::RunEvent` (direct usage)
   - File: `src-tauri/src/main.rs`

5. **Configuration Changes**
   - `tauri.conf.json` migrated to v2 format
   - `distDir` → `frontendDist`
   - `devPath` → `devUrl`
   - Removed `trayIcon` from config (needs plugin reimplementation)

### TypeScript/Frontend Changes

1. **HTTP Plugin API**
   - Changed from: `fetch<string>(url, { responseType: ResponseType.Text }).then(res => res.data)`
   - Changed to: `fetch(url, { method: 'GET' }).then(res => res.text())`
   - File: `src/modules/dictionary/index.tsx`

2. **Shell Command API**
   - Changed from: `new Command('cmd', args)`
   - Changed to: `Command.create('cmd', args)`
   - File: `src/modules/tauri/components/shell/index.tsx`

3. **FS writeTextFile API**
   - Changed from: `writeTextFile({ contents, path }, { dir: BaseDirectory.Home })`
   - Changed to: `writeTextFile(path, contents, { baseDir: BaseDirectory.Home })`
   - File: `src/modules/tauri/components/shell/index.tsx`

4. **Import Path Updates**
   - Changed from: `import { invoke } from '@tauri-apps/api'`
   - Changed to: `import { invoke } from '@tauri-apps/api/core'`
   - File: `src/modules/tauri/components/storage/index.tsx`

## Features Temporarily Disabled

### Menu System
- **Status**: Disabled during migration
- **Reason**: Tauri v2 completely redesigned the menu API
- **Files affected**: `src-tauri/src/menus/mod.rs`, `src-tauri/src/main.rs`
- **TODO**: Reimplement using Tauri v2's new menu API

### System Tray
- **Status**: Disabled during migration
- **Reason**: Tauri v2 moved system tray to a plugin-based system
- **Files affected**: `src-tauri/src/main.rs`, `src-tauri/tauri.conf.json`
- **TODO**: Install and configure `tauri-plugin-tray` and reimplement tray functionality

## New Capabilities System

Tauri v2 introduces a new permissions/capabilities system. Migration created:
- `src-tauri/capabilities/migrated.json` - Migrated v1 permissions
- `src-tauri/capabilities/desktop.json` - Desktop-specific capabilities

## Build Status

✅ **All builds successful:**
- Frontend build: `pnpm run build` ✓
- Rust check: `cargo check` ✓
- Rust release build: `cargo build --release` ✓

## Known Warnings

Minor warnings remain but don't affect functionality:
- Unused variables in Rust code
- Browserslist outdated warning (cosmetic)

## Future Work

1. **Reimplement Menu System**
   - Use `tauri::menu` API
   - Refer to Tauri v2 menu documentation

2. **Reimplement System Tray**
   - Add `tauri-plugin-tray` dependency
   - Implement using plugin API

3. **Consider Additional Optimizations**
   - Code splitting for frontend bundle size
   - Update browserslist database

## Testing Recommendations

Before deploying to production:
1. Test all Tauri commands (greet, db operations, blockchain commands)
2. Test shell execution features
3. Test file system operations
4. Test HTTP fetch functionality
5. Test event system if reimplemented
6. Test on all target platforms (Windows, macOS, Linux)

## References

- [Tauri v2 Migration Guide](https://v2.tauri.app/start/migrate/)
- [Tauri v2 API Documentation](https://v2.tauri.app/reference/)
- [Vite v5 Migration Guide](https://vitejs.dev/guide/migration.html)
