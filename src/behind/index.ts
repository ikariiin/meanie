import * as express from 'express';
import * as ExpressWS from 'express-ws';
import * as WebSocket from "ws";
import { WebSocketHandler } from "./modules/websocket";
import {createConnection} from "typeorm";
import {Torrent} from "./modules/torrent";
import "reflect-metadata";
import {Cron} from "./modules/cron";
import {FeedManagementRouter} from "./modules/feed-management";

import {setDB} from "./middlewares/db";
import {apiMiddleWare} from "./middlewares/api";

// Entities
import {Feed} from "./entitiy/feed";
import {SearchRouter} from "./modules/search";

const app = express();
ExpressWS(app);

// Create a DB connection
async function initializeApp() {
  const connection = await createConnection({
    type: "mongodb",
    host: "localhost",
    database: "meanie",
    synchronize: true,
    entities: [
      Feed
    ]
  });

  const torrent = new Torrent(connection);
  const cron = new Cron(connection);

  cron.start();

  // MiddleWares
  app.use(setDB(connection));
  app.use(apiMiddleWare);
  app.use(express.json());

  // WebSocket endpoint
  // @ts-ignore
  app.ws("/websocket", (ws: WebSocket, request: express.Request) => {
    const websocketHandler = new WebSocketHandler(ws);
    websocketHandler.attachHandlers();
  });

  // Routers
  app.use("/feeds", FeedManagementRouter);
  app.use("/search", SearchRouter);

  const server = app.listen(9090, () => console.log("Ctrl + C to stop the server"));
}

initializeApp();