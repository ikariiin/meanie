import * as config from "./config.json";
import {Connection} from "typeorm";
import {platform} from "os";
import {Settings} from "./entitiy/settings";
import {used as driveLetters} from "windows-drive-letters";
import {promises as fs} from "fs";

async function getFSSavePath(): Promise<string> {
  switch (platform()) {
    case "win32":
      const letters = await driveLetters();
      // Might put in a better logic next time though
      return letters[0] + ":\\Meanie Downloads";
    case "linux":
        return "";
    default:
      return "";
  }
}

async function markAsInstalled() {
  const rawConfig = (await fs.readFile(__dirname + "/config.json")).toString();
  const parsedConfig = JSON.parse(rawConfig);
  parsedConfig.installed = true;
  await fs.writeFile(__dirname + "/config.json", JSON.stringify(parsedConfig, null, 2));
}

export async function install(connection: Connection): Promise<void> {
  console.log("Is installed?", config.installed);
  if(config.installed) return;

  console.log("Installing...");

  const defaultFSSavePath = new Settings();
  defaultFSSavePath.name = "fs.savePath";
  defaultFSSavePath.value = await getFSSavePath();

  await connection.mongoManager.save(defaultFSSavePath);

  const pollRate = new Settings();
  pollRate.name = "general.pollRate";
  pollRate.value = "600";

  await connection.mongoManager.save(pollRate);
  await markAsInstalled();
}