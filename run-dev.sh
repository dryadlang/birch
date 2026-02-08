#!/bin/bash
# Birch IDE Launcher
# Workaround for NVIDIA GPU + WebKitGTK rendering issues

export GDK_BACKEND=x11
export WAYLAND_DISPLAY=
export WEBKIT_DISABLE_COMPOSITING_MODE=1
export LIBGL_ALWAYS_SOFTWARE=1

npm run tauri dev
