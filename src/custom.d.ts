import {Connection} from "typeorm";
import {Cron} from "./behind/modules/cron";
import {Torrent} from "./behind/modules/torrent";

declare global {
  namespace Express {
    export interface Request {
      db: Connection;
      cron: Cron;
      torrent: Torrent;
    }
  }
}