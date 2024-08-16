export default defineNitroPlugin(async (nitroApp) => {
  const listenHost = process.env.HOST || "localhost";
  const listenPort = process.env.PORT || 3000;

  process.env.NITRO_LISTEN_URL = `http://${listenHost}:${listenPort}/`;  
  
  if (process.env.NODE_ENV === "development") {
    process.env.NITRO_SWAGGER_URL = `${process.env.NITRO_LISTEN_URL}_nitro/swagger`;

    const { spawn } = await import("node:child_process");

    const electron = await import("electron");
    const electronPath = <any>(electron.default ?? electron);

    const argv = [".", "--no-sandbox"];
    process.electronApp = spawn(electronPath, argv, {
      stdio: "inherit",
      env: { ...process.env, NODE_ENV: "development" }
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
