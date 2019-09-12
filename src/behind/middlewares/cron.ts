import * as express from "express";
import {Cron} from "../modules/cron";

export function setCron(cron: Cron): (req: express.Request, res: express.Response, next: Function) => void {
  return (req, res, next) => {
    req.cron = cron;
    next();
  }
}