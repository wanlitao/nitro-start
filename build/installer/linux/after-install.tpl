#!/bin/bash

# 刷新 desktop 数据库
echo "Updating desktop database..."
update-desktop-database /usr/share/applications

# 注册自定义协议
echo "Registering URL scheme handler for nitro-electron..."
xdg-mime default "nitro-electron-app.desktop" "x-scheme-handler/nitro-electron"

echo "Registration complete. nitro-electron:// protocol is now handled by nitro-electron-app."

exit 0
