export default defineNitroPlugin(async (nitroApp) => {
  const listenHost = process.env.NITRO_HOST || process.env.HOST || "localhost";
  const listenPort = process.env.NITRO_PORT || process.env.PORT || 3000;

  process.env.NITRO_LISTEN_URL = `http://${listenHost}:${listenPort}/`;
  process.env.NITRO_SWAGGER_URL = `${process.env.NITRO_LISTEN_URL}_swagger`;

  if (process.env.NODE_ENV === "development") {
    const { spawn } = await import("node:child_process");

    const electron = await import("electron");
    const electronPath = <any>(electron.default ?? electron);

    const argv = [".", "--no-sandbox"];
    process.electronApp = spawn(electronPath, argv, {
      stdio: ["inherit", "pipe", "inherit"],
      env: { ...process.env, NODE_ENV: "development" },
    });

    // 监听子进程的 stdout 并将其输出到父进程的控制台
    process.electronApp.stdout.on("data", (data) => {
      console.log(`electron stdout: ${data}`);
    });

    process.electronApp.once("exit", () => {
      delete process.electronApp;
    });

    nitroApp.hooks.hookOnce("close", () => {
      if (process.electronApp) {
        process.electronApp.removeAllListeners();
        process.electronApp.kill();
      }
    });
  }
});
