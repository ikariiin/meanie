import {Connection} from "typeorm";
import * as express from "express";
import {FeedResult} from "../../ui/javascript/bundles/display/components/result-box";
import {formatAPIResponse} from "../util/response-formatter";
import * as WebTorrent from "webtorrent";
import {Settings} from "../entitiy/settings";
import {Server} from "http";
import { Downloads } from "../entitiy/downloads";
import { DownloadDetails } from "../entitiy/download-details";

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
    const settingsRepository = await this.dbConn.getRepository(Settings);
    const savePath = (await settingsRepository.find({ name: "fs.savePath" }))[0].value;
    this.client.add(newTorrent.torrentLink, { path: savePath }, async (torrent) => {
      const fsStorePath = `${savePath}/${torrent.name}`;
      this.torrents.push({
        webTorrent: torrent,
        details: newTorrent,
        dir: fsStorePath,
        title: `${torrent.name}`
      });

      // Save to database
      const downloadsRepository = this.dbConn.getRepository(Downloads);
      const downloadDetailsRepository = this.dbConn.getRepository(DownloadDetails);

      // Check if it is already added, if so this torrent is being submitted for resuming after restart.
      const [_, downloadsCount] = await downloadsRepository.findAndCount({ where: { fsLink: fsStorePath } });
      if (downloadsCount !== 0) return;

      const downloadDetails = new DownloadDetails();
      Object.assign(downloadDetails, newTorrent);
      await downloadDetailsRepository.save(downloadDetails);
      
      const download = new Downloads();
      download.type = "download";
      download.details = downloadDetails;
      download.feedURL = newTorrent.torrentLink;
      download.fsLink = fsStorePath;
      download.running = true;
      await downloadsRepository.save(download);
    });
  }

  public watch(handler: ActivityWatcher): void {
  }

  public async pause(torrent: ITorrent_Transportable): Promise<void> {
    const internalTorrent = this.torrents.find(existingTorrent => existingTorrent.dir === torrent.dir);

    if (!internalTorrent) return;

    const downloadsRepository = this.dbConn.getRepository(Downloads);
    const dbDownload = await downloadsRepository.findOne({ fsLink: internalTorrent.dir });

    if (!dbDownload) return;
    dbDownload.running = false;
    await downloadsRepository.save(dbDownload);

    internalTorrent.webTorrent.destroy();
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

  public stopAll(): void {
    this.torrents.forEach(torrent => {
      torrent.webTorrent.pause();
    });
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

TorrentRouter.get("/running", async (req: express.Request, res: express.Response) => {
  const downloadsRepository = req.db.getRepository(Downloads);
  const runningDownloads = await downloadsRepository.find({ where: { running: true }, relations: ['details'] });

  res.json(runningDownloads);
});

TorrentRouter.post("/pause", (req: express.Request, res: express.Response) => {
  const torrent: ITorrent_Transportable = req.body;

  req.torrent.pause(torrent);
})

export { TorrentRouter };