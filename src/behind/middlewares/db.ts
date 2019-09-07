import {Connection} from "typeorm";
import * as express from "express";

export function setDB(dbConnection: Connection): (req: express.Request, res: express.Response, next: Function) => void {
  return (req, res, next) => {
    req.db = dbConnection;
    next();
  }
}