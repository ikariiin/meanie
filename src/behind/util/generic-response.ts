import * as express from "express";

export function sendImproperRequestError(res: express.Response) {
  res.sendStatus(500);
}