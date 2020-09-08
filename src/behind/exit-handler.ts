import { Torrent } from "./modules/torrent";

export function registerExitHandlers(
  torrent: Torrent
): void {
  async function exitHandler(): Promise<void> {
    console.log("App exited. Trying to shut down gracefully...");

    console.log("Pausing all running torrents...");
    torrent.stopAll();
    process.exit();
  }

  process.on('exit', exitHandler);

  //catches ctrl+c event
  process.on('SIGINT', exitHandler);

  // catches "kill pid" (for example: nodemon restart)
  process.on('SIGUSR1', exitHandler);
  process.on('SIGUSR2', exitHandler);

  //catches uncaught exceptions
  process.on('uncaughtException', exitHandler);
}