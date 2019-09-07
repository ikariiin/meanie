import * as express from 'express';

export function apiMiddleWare(req: express.Request, res: express.Response, next: Function) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
}