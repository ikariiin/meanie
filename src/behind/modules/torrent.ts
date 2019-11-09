import {Connection} from "typeorm";
import * as express from "express";
import {FeedResult} from "../../ui/javascript/bundles/display/components/result-box";
import {formatAPIResponse} from "../util/response-formatter";
import * as WebTorrent from "webtorrent";
import {Settings} from "../entitiy/settings";
import {Server} from "http";

export interface ITorrent {
  title: string;
  dir: string;
  webTorrent: WebTorrent.Torrent;
  details: FeedResult;
}

export interface File {
  name: string;
  torrentPath: string;
  size: number;
  downloaded: number;
  progress: number;
};

export interface Torrent_Transportable {
  announce: Array<string>;
  infoHash: string;
  name: string;
  timeRemaining: number;
  downloaded: number;
  downloadSpeed: number;
  progress: number;
  numPeers: number;
  done: boolean;
  created: Date;
  files: Array<File>;
}

export interface ITorrent_Transportable {
  title: string;
  dir: string;
  webTorrent: Torrent_Transportable;
  details: FeedResult;
}

export interface TorrentServer {
  torrent: Torrent_Transportable;
  server: Server;
}

export type ActivityWatcher = (torrent: ITorrent_Transportable) => void;
export type TorrentsWatcher = (torrents: Array<ITorrent_Transportable>) => void;

export class Torrent {
  private dbConn: Connection;
  private client: WebTorrent.Instance;
  private torrents: Array<ITorrent> = [];
  private servers: Map<string, TorrentServer> = new Map();

  constructor(dbConn: Connection) {
    this.dbConn = dbConn;
    this.client = new WebTorrent();
  }

  public async lookForNewTorrent(): Promise<void> {
    //
  }

  public async submit(newTorrent: FeedResult) {
    const savePath = (await this.dbConn.mongoManager.find(Settings, { name: "fs.savePath" }))[0].value;
    this.client.add(newTorrent.torrentLink, { path: savePath }, (torrent) => this.torrents.push({
      webTorrent: torrent,
      details: newTorrent,
      dir: `${savePath}/${torrent.name}`,
      title: `${torrent.name}`
    }));
  }

  public watch(handler: ActivityWatcher): void {
  }

  protected convertToTransportable(webTorrent: WebTorrent.Torrent) {
    return {
      name: webTorrent.name,
      announce: webTorrent.announce,
      created: webTorrent.created,
      done: webTorrent.done,
      downloaded: webTorrent.downloaded,
      downloadSpeed: webTorrent.downloadSpeed,
      infoHash: webTorrent.infoHash,
      numPeers: webTorrent.numPeers,
      progress: webTorrent.progress,
      timeRemaining: webTorrent.timeRemaining,
      files: webTorrent.files.map(file => ({
        name: file.name,
        downloaded: file.downloaded,
        size: file.length,
        torrentPath: file.path,
        // @ts-ignore
        progress: file.progress
      }))
    };
  }

  public watchAll(handler: TorrentsWatcher): NodeJS.Timeout {
    return setInterval(() => {
      handler(this.torrents.map(torrent => {
        const webTorrent = torrent.webTorrent;

        return {
          ...torrent,
          webTorrent: this.convertToTransportable(webTorrent)
        }
      }));
    }, 1000);
  }

  public serveFile(infoHash: string): number {
    const torrent = this.torrents.filter(torrent => torrent.webTorrent.infoHash === infoHash)[0];
    const httpServer = torrent.webTorrent.createServer({
    });
    const port = Math.ceil(Math.random() * 1000);
    httpServer.listen(port);
    this.servers.set(torrent.webTorrent.infoHash, {
      server: httpServer,
      torrent: this.convertToTransportable(torrent.webTorrent)
    });

    return port;
  }
}

const TorrentRouter = express.Router();

TorrentRouter.post("/new", (req: express.Request, res: express.Response) => {
  const newTorrent: FeedResult = req.body;
  req.torrent.submit(newTorrent);

  formatAPIResponse(res, {
    submitted: true
  });
});

TorrentRouter.get("/view/:infoHash/:fileIndex", (req: express.Request, res: express.Response) => {
  const { infoHash, fileIndex } = req.params;
  const port = req.torrent.serveFile(infoHash);
  const uri = `http://localhost:${port}/${fileIndex}`;

  formatAPIResponse(res, {
    uri
  });
});

export { TorrentRouter };