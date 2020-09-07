import * as express from 'express';
import { sendImproperRequestError } from "../util/generic-response";

const FeedManagementRouter = express.Router();

FeedManagementRouter.post('/add', (req: express.Request, res: express.Response) => {
  const url = req.body.url;
  if(!url) sendImproperRequestError(res);

  req.cron.add({
    url
  });

  res.sendStatus(200);
});

export { FeedManagementRouter };