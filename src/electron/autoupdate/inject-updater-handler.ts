// @ts-nocheck
window.electronIpc.on("updater-checking", () => {    
    console.log("自动更新：正在检测更新");    
});
window.electronIpc.on("updater-available", (info) => {
    console.log(`自动更新：有可用更新, 版本：${info.version}`);
    new window.Notification("自动更新", { body: `检测到新版本：${info.version}` });
});
window.electronIpc.on("updater-not-available", (info) => {
    console.log("自动更新：没有可用更新");
});
window.electronIpc.on("updater-error", (err) => {
    console.log(`自动更新：发生错误, 错误信息：${err.message}`);
});
window.electronIpc.on("updater-download-progress", (progressInfo) => {
    console.log(`自动更新：下载进度, 已下载：${progressInfo.percent.toFixed(2)}%, 速度：${(progressInfo.bytesPerSecond / 1024).toFixed(2)} kb/s`);
});
window.electronIpc.on("updater-downloaded", (event) => {
    console.log(`自动更新：下载完成, 文件：${event.downloadedFile}`);
});

window.electronIpc.checkUpdate();