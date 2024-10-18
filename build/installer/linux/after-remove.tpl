#!/bin/bash

# 刷新 desktop 数据库
echo "Updating desktop database..."
update-desktop-database /usr/share/applications

# 取消注册自定义协议
echo "Unregistering URL scheme handler for nitro-electron..."
xdg-mime default "" "x-scheme-handler/nitro-electron"

echo "Unregistration complete. nitro-electron:// protocol has been removed."

exit 0
