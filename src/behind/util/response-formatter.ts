import * as express from 'express';

export function formatAPIResponse(res: express.Response, data: any) {
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(data, null, 2));
}