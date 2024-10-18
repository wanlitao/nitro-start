import { ipcMain } from "electron";

export const protocol_scheme = "nitro-electron";

export const configureProtocolUrlHandler = (
  protocolUrlHandler: (protocolUrl: string) => void
) => {
  ipcMain.on("protocol-open-url", (event, protocolUrlArg) => {    
    protocolUrlHandler(protocolUrlArg);
  });
};

const resolveProtocolUrlArg = (argv: string[]) => {
  const protocolUrlPrefix = `${protocol_scheme}://`;

  return argv.find((arg) => arg.startsWith(protocolUrlPrefix));
};

export const checkProcessProtocolUrlArg = (argv: string[]) => {
  const protocolUrlArg = resolveProtocolUrlArg(argv);

  if (protocolUrlArg) {
    ipcMain.emit("protocol-open-url", null, protocolUrlArg);
  }
}
