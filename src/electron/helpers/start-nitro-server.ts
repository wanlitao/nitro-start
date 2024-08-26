import { app, utilityProcess } from "electron";
import path from "node:path";

let nitro_server_process;

const resolveBackgroundNitroListenUrl = () => {
  const nitro_host = process.env.NITRO_HOST || "localhost";
  const nitro_port = process.env.NITRO_PORT || 3000;

  process.env.NITRO_LISTEN_URL = `http://${nitro_host}:${nitro_port}/`;
};

const listenAppQuitToStopNitroServer = () => {
  app.on("before-quit", () => {
    if (nitro_server_process) {
      nitro_server_process.kill();
      nitro_server_process = null;
    }
  });
};

export const startBackgroundNitroServer = () => {
  const nitro_dist = path.join(process.env.APP_ROOT, "dist/backend");
  const nitro_server_indexjs = path.join(nitro_dist, "server/index.mjs");

  nitro_server_process = utilityProcess.fork(nitro_server_indexjs);

  resolveBackgroundNitroListenUrl();

  listenAppQuitToStopNitroServer();
};
