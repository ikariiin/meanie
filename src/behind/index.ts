import * as express from 'express';
import * as ExpressWS from 'express-ws';
import * as WebSocket from "ws";
import { WebSocketHandler } from "./modules/websocket";
import {createConnection} from "typeorm";
import {Torrent, TorrentRouter} from "./modules/torrent";
import "reflect-metadata";
import {Cron} from "./modules/cron";
import {install} from "./install";

// MiddleWare imports
import {setDB} from "./middlewares/db";
import {apiMiddleWare} from "./middlewares/api";
import {setCron} from "./middlewares/cron";
import {setTorrent} from "./middlewares/torrent";

// Entities
import {Feed} from "./entitiy/feed";
import {Downloads} from "./entitiy/downloads";
import {Settings} from "./entitiy/settings";

// Routers
import {SearchRouter} from "./modules/search";
import {FeedManagementRouter} from "./modules/feed-management";
import {AnitomyRouter} from "./modules/anitomy";
import {SettingsRouter} from "./modules/settings";

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
      Feed,
      Downloads,
      Settings
    ],
    useNewUrlParser: true,
  });

  // Install
  await install(connection);

  const torrent = new Torrent(connection);
  const cron = new Cron(connection);
  cron.start();

  // MiddleWares
  app.use(setDB(connection));
  app.use(setTorrent(torrent));
  app.use(apiMiddleWare);
  app.use(express.json());
  app.use(setCron(cron));

  // WebSocket endpoint
  // @ts-ignore
  app.ws("/websocket", (ws: WebSocket, request: express.Request) => {
    const websocketHandler = new WebSocketHandler(ws, request.torrent, request.db);
    websocketHandler.attachHandlers();
  });

  // Routers
  app.use("/feeds", FeedManagementRouter);
  app.use("/search", SearchRouter);
  app.use("/anitomy", AnitomyRouter);
  app.use("/settings", SettingsRouter);
  app.use("/torrents", TorrentRouter);

  const server = app.listen(9090, () => console.log("Ctrl + C to stop the server"));
}

initializeApp();