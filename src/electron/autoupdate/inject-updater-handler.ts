// @ts-nocheck
window.askForInstallUpdate = function () {
  window.electronIpc
    .showMessageBox({
      type: "info",
      title: "更新提示",
      message: "下载完成，是否立即安装更新",
      buttons: ["立即安装", "稍后提醒", "取消"],
    })
    .then((result) => {
      if (result === 0) {
        window.electronIpc.quitToinstallUpdate();
      } else if (result === 1) {
        // 10分钟后再次询问
        setTimeout(window.askForInstallUpdate, 1000 * 60 * 10);
      }
    });
};

window.electronIpc.on("updater-checking", () => {
  console.log("自动更新：正在检测更新");
});
window.electronIpc.on("updater-available", (ev, info) => {
  console.log(`自动更新：有可用更新, 版本：${info.version}`);

  window.electronIpc
    .showMessageBox({
      type: "info",
      title: "更新提示",
      message: `检测到新版本：${info.version}`,
      buttons: ["下载更新", "取消"],
    })
    .then((result) => {
      if (result === 0) {
        window.electronIpc.downloadUpdate();
      }
    });
});
window.electronIpc.on("updater-not-available", (ev, info) => {
  console.log("自动更新：没有可用更新");
});
window.electronIpc.on("updater-error", (ev, err, msg) => {
  console.log(`自动更新：发生错误, 错误信息：${err.message}`);

  window.electronIpc.showNotification({
    title: "更新提示",
    body: `发生错误, 错误信息：${err.message}`,
  });
});
window.electronIpc.on("updater-download-progress", (ev, progressInfo) => {
  const percent = progressInfo.percent.toFixed(2);
  const kbytesPerSecond = (progressInfo.bytesPerSecond / 1024).toFixed(2);

  console.log(`自动更新：下载进度：${percent}%, 速度：${kbytesPerSecond} kb/s`);

  window.electronIpc.showNotification({
    title: "更新提示",
    body: `下载进度: ${percent}%, 速度: ${kbytesPerSecond} kb/s`,
  });
});
window.electronIpc.on("updater-downloaded", (ev, event) => {
  console.log(`自动更新：下载完成, 文件路径：${event.downloadedFile}`);

  window.askForInstallUpdate();
});

window.electronIpc.checkUpdate();
