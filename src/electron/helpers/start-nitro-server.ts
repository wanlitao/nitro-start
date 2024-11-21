import { app, utilityProcess, ipcMain } from "electron";
import path from "node:path";

let nitro_server_process;

const resolveBackgroundNitroListenUrl = () => {
  const nitro_host = process.env.NITRO_HOST || process.env.HOST || "localhost";
  const nitro_port = process.env.NITRO_PORT || process.env.PORT || 3000;

  process.env.NITRO_LISTEN_URL = `http://${nitro_host}:${nitro_port}/`;
  process.env.NITRO_SWAGGER_URL = `${process.env.NITRO_LISTEN_URL}_swagger`;
};

const listenAppQuitToStopNitroServer = () => {
  app.on("before-quit", () => {
    if (nitro_server_process) {
      nitro_server_process.removeAllListeners();
      nitro_server_process.kill();
      nitro_server_process = null;
    }
  });
};

const configureNitroServerConsoleOutput = () => {
  nitro_server_process.stdout.on("data", (data) => {
    ipcMain.emit("nitro-server-console", null, `nitro server stdout: ${data}`);
  });

  nitro_server_process.stderr.on("data", (data) => {
    ipcMain.emit("nitro-server-console", null, `nitro server stderr: ${data}`);
  });

  nitro_server_process.on("error", (err) => {
    ipcMain.emit("nitro-server-console", null, `nitro server error: ${err}`);
  });

  nitro_server_process.on("exit", (code) => {
    ipcMain.emit(
      "nitro-server-console",
      null,
      `nitro server exited with code ${code}`
    );
  });
};

export const startBackgroundNitroServer = () => {
  const nitro_dist = path.join(process.env.APP_ROOT, "dist/backend");
  const nitro_server_indexjs = path.join(nitro_dist, "server/index.mjs");

  nitro_server_process = utilityProcess.fork(nitro_server_indexjs, [], {
    stdio: "pipe",
    execArgv: [
      "--enable-source-maps",
      "--trace-warnings",
      "--abort-on-uncaught-exception",
    ],
  });

  configureNitroServerConsoleOutput();

  resolveBackgroundNitroListenUrl();

  listenAppQuitToStopNitroServer();
};
