import {Connection} from "typeorm";

export interface IActivity {
  title: string;
  dir: string;
}

export enum Option {
  PROGRESS,
  ACTIVITY
}

export type ActivityHandler = (activities: Array<IActivity>) => void;

export class Torrent {
  private dbConn: Connection;

  constructor(dbConn: Connection) {
    this.dbConn = dbConn;
  }

  public async lookForNewTorrent(): Promise<void> {
    //
  }

  public watch(option: Option, handler: ActivityHandler): void {
    if(option === Option.ACTIVITY) {
      //
    }
  }
}