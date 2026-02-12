# Birch IDE Enhancement Implementation Plan

This plan outlines the steps to redesign the Birch IDE with a unique JetBrains-inspired aesthetic, functional settings, Dryad integration, and a plugin system.

## Proposed Changes

### [Component Name] Core UI Redesign

Redesign the main layout to feel more "JetBrains-like" and less like VS Code. This involves updating `App.css` and potentially layout components.

#### [MODIFY] [App.css](file:///c:/Users/Pedro%20Jesus/Downloads/birch/src/App.css)

- Refactor CSS variables to support a broader range of themes.
- Implement "JetBrains Darcula" and "Birch Unique" (glassmorphism/vibrant) themes.
- Update UI element styles: rounded corners, specific spacing, and typography (Inter/JetBrains Mono).
- Change the Activity Bar and Sidebar styles to match JetBrains New UI.

#### [MODIFY] [App.tsx](file:///c:/Users/Pedro%20Jesus/Downloads/birch/src/App.tsx)

- Update the layout structure to allow for a more customizable UI (e.g., repositionable bars).
- Implement a global `ThemeContext` or update the `data-theme` logic.

### Settings Functionality

Ensure all settings in the `SettingsPanel` are functional and persist across sessions.

#### [MODIFY] [SettingsPanel.tsx](file:///c:/Users/Pedro%20Jesus/Downloads/birch/src/components/SettingsPanel.tsx)

- Ensure all toggles and inputs correctly update the `Settings` object.

#### [MODIFY] [App.tsx](file:///c:/Users/Pedro%20Jesus/Downloads/birch/src/App.tsx)

- Improve persistence logic using `localStorage` and ensure real-time application of all settings (FontSize, FontFamily, etc.).

### Dryad Integration

Integrate Birch with the Dryad language core and Oak package manager.

#### [MODIFY] [src-tauri/src/main.rs](file:///c:/Users/Pedro%20Jesus/Downloads/birch/src-tauri/src/main.rs)

- Add Tauri commands to execute `dryad.exe` and `oak.exe`.
- Implement a `run_dryad_script` command that captures output.
- Implement `create_dryad_project` command that calls `oak init <name> --type=<project|library>` in the specified location.

#### [MODIFY] [NewProjectWizard.tsx](file:///c:/Users/Pedro%20Jesus/Downloads/birch/src/components/NewProjectWizard.tsx)

- Update templates to include "Dryad Project" and "Dryad Library".
- Connect the "Create" action for Dryad templates to the `create_dryad_project` Tauri command.

#### [MODIFY] [StatusBar.tsx](file:///c:/Users/Pedro%20Jesus/Downloads/birch/src/components/StatusBar.tsx)

- Add a "Run Dryad" button or status indicator.

### Plugin System

Implement a basic plugin architecture.

#### [NEW] [PluginSystem.ts](file:///c:/Users/Pedro%20Jesus/Downloads/birch/src/lib/PluginSystem.ts)

- Define `BirchPlugin` interface.
- Implement a `PluginManager` to load and initialize plugins.

## Verification Plan

### Automated Tests

- Run `npm run test` (if available) to ensure no regressions.
- Verify Tauri command functionality via `cargo test`.

### Manual Verification

- **Theme Switching**: Open settings and switch between 'Dark', 'Light', 'JetBrains Darcula', and 'Birch Unique'. Verify all UI elements update correctly.
- **Settings Persistence**: Change font size, close the app, and reopen. Verify the font size is preserved.
- **Dryad Execution**: Create a `.dryad` file, write some code, and click "Run". Verify output appears in the panel.
- **Plugin Loading**: Register a test plugin that adds a menu item or console log. Verify it executes on startup.
