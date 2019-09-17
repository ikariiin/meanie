import {Connection} from "typeorm";
import * as express from "express";
import {FeedResult} from "../../ui/javascript/bundles/display/components/result-box";
import {formatAPIResponse} from "../util/response-formatter";
import * as WebTorrent from "webtorrent";
import {Settings} from "../entitiy/settings";

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

export interface ITorrent_Transportable {
  title: string;
  dir: string;
  webTorrent: {
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
    files: Array<File>
  };
  details: FeedResult;
}

export enum Option {
  PROGRESS,
  ACTIVITY
}

export type ActivityWatcher = (torrent: ITorrent_Transportable) => void;
export type TorrentsWatcher = (torrents: Array<ITorrent_Transportable>) => void;

export class Torrent {
  private dbConn: Connection;
  private client: WebTorrent.Instance;
  private torrents: Array<ITorrent> = [];

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

  public watchAll(handler: TorrentsWatcher): NodeJS.Timeout {
    return setInterval(() => {
      handler(this.torrents.map(torrent => {
        const webTorrent = torrent.webTorrent;

        return {
          ...torrent,
          webTorrent: {
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
          }
        }
      }));
    }, 1000);
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

export { TorrentRouter };