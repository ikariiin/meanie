import * as express from "express";
import {Torrent} from "../modules/torrent";

export function setTorrent(torrent: Torrent): (req: express.Request, res: express.Response, next: Function) => void {
  return (req, res, next) => {
    req.torrent = torrent;
    next();
  }
}