import { Connection } from "typeorm";
import * as express from "express";
import { FeedResult } from "../../ui/javascript/bundles/display/components/result-box";
import { formatAPIResponse } from "../util/response-formatter";
import * as WebTorrent from "webtorrent";
import { Settings } from "../entitiy/settings";
import { Server } from "http";
import { Downloads } from "../entitiy/downloads";
import { DownloadDetails } from "../entitiy/download-details";
import { promises as fs } from 'fs';

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
  paused: boolean;
  ready: boolean;
}

export interface ITorrent_Transportable {
  title: string;
  dir: string;
  webTorrent: Torrent_Transportable;
  details: FeedResult;
  paused: boolean;
}

export interface TorrentServer {
  torrent: Torrent_Transportable;
  server: Server;
}

export type MutationWatcher = (torrent: Torrent_Transportable, mutationType: MutationType) => void;
export type MutationType = "add" | "pause" | "delete";
export type ActivityWatcher = (torrent: ITorrent_Transportable) => void;
export type TorrentsWatcher = (torrents: Array<ITorrent_Transportable>) => void;

export class Torrent {
  private dbConn: Connection;
  private client: WebTorrent.Instance;
  private torrents: Array<ITorrent> = [];
  private servers: Map<string, TorrentServer> = new Map();
  private mutationWatchers: Array<MutationWatcher> = [];
  /**
   * Map: infoHash -> pause state
   */
  private pausedMap: Map<string, boolean> = new Map();

  constructor(dbConn: Connection) {
    this.dbConn = dbConn;
    this.client = new WebTorrent();
  }

  public async lookForNewTorrent(): Promise<void> {
    //
  }

  private async clientAddCallback(
    torrent: WebTorrent.Torrent,
    savePath: string,
    newTorrent: FeedResult,
    onlyInit?: boolean,
    filterPreExisting?: boolean
  ): Promise<void> {
    const fsStorePath = `${savePath}/${torrent.name}`;
    if (filterPreExisting) this.torrents = this.torrents.filter(internalTorrent => internalTorrent.webTorrent.infoHash !== torrent.infoHash);
    this.mutationWatchers.forEach(watcher => watcher(this.convertToTransportable(torrent), "add"));

    this.torrents.push({
      webTorrent: torrent,
      details: newTorrent,
      dir: fsStorePath,
      title: `${torrent.name}`
    });

    if (onlyInit) {
      torrent.destroy(() => this.pausedMap.set(torrent.infoHash, true));
      this.mutationWatchers.forEach(watcher => watcher(this.convertToTransportable(torrent), "pause"));
    }
    this.pausedMap.set(torrent.infoHash, false);

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
  }

  public async submit(newTorrent: FeedResult, onlyInit?: boolean): Promise<void> {
    const settingsRepository = this.dbConn.getRepository(Settings);
    const savePath = (await settingsRepository.find({ name: "fs.savePath" }))[0].value;

    // Check if the requested torrent is already added in case of only init.
    // This is required because the torrent if paused or only init'd so far, its destroyed.
    // So the client will try to add the torrent again, resulting in a duplicate.
    if (onlyInit && this.torrents.find(torrent => torrent.details.torrentLink === newTorrent.torrentLink)) {
      return;
    }

    this.client.add(newTorrent.torrentLink, { path: savePath }, torrent => {
      this.clientAddCallback(
        torrent,
        savePath,
        newTorrent,
        onlyInit
      );
    });
  }

  /**
   * NOTE: Be sure the torrent you are trying to resume is already init'd and added to the client.
   * @param torrent {ITorrent_Transportable}
   */
  public async resume(torrent: ITorrent_Transportable): Promise<void> {
    const internalTorrent = this.torrents.find(existingTorrent => existingTorrent.dir === torrent.dir);
    if (!internalTorrent) return;
    const downloadsRepository = this.dbConn.getRepository(Downloads);
    const dbDownload = await downloadsRepository.findOne({ fsLink: internalTorrent.dir });
    const settingsRepository = this.dbConn.getRepository(Settings);
    const savePath = (await settingsRepository.find({ name: "fs.savePath" }))[0].value;
    if (!dbDownload) return;
    dbDownload.running = true;
    await downloadsRepository.save(dbDownload);
    this.client.add(internalTorrent.details.torrentLink, { path: savePath }, async (torrent) => {
      await this.clientAddCallback(
        torrent,
        savePath,
        internalTorrent.details,
        false,
        true
      );
    });
  }

  public watch(handler: ActivityWatcher): void {
  }

  public addMutationWatcher(watcher: MutationWatcher): number {
    // Array.push returns the new length of the array, so we negate 1 to get the index of the new watcher.
    return this.mutationWatchers.push(watcher) - 1;
  }

  public async pause(torrent: ITorrent_Transportable): Promise<void> {
    const internalTorrent = this.torrents.find(existingTorrent => existingTorrent.dir === torrent.dir);
    if (!internalTorrent) return;
    const downloadsRepository = this.dbConn.getRepository(Downloads);
    const dbDownload = await downloadsRepository.findOne({ fsLink: internalTorrent.dir });
    if (!dbDownload) return;
    dbDownload.running = false;
    await downloadsRepository.save(dbDownload);
    internalTorrent.webTorrent.destroy(() => {
      this.pausedMap.set(internalTorrent.webTorrent.infoHash, true);
      this.mutationWatchers.forEach(watcher => watcher(this.convertToTransportable(internalTorrent.webTorrent), "pause"));
    });
  }

  public async delete(torrent: ITorrent_Transportable, deleteFiles: "true"|"false"): Promise<void> {
    const internalTorrent = this.torrents.find(existingTorrent => existingTorrent.dir === torrent.dir);
    if (!internalTorrent) return;
    const downloadsRepository = this.dbConn.getRepository(Downloads);
    const download = await downloadsRepository.findOne({ fsLink: internalTorrent.dir });
    if (!download) return;
    await downloadsRepository.remove(download);
    internalTorrent.webTorrent.destroy(async () => {
      if (deleteFiles === "true") {
        console.log(`Deleting file ${internalTorrent.dir}`);
        await fs.unlink(internalTorrent.dir);
      }
      this.pausedMap.delete(internalTorrent.webTorrent.infoHash);
      this.torrents = this.torrents.filter(_torrent => torrent.dir !== _torrent.dir);
      this.mutationWatchers.forEach(watcher => watcher(this.convertToTransportable(internalTorrent.webTorrent), "delete"));
    });
  }

  protected convertToTransportable(webTorrent: WebTorrent.Torrent): Torrent_Transportable {
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
      paused: webTorrent.paused,
      ready: webTorrent.ready,
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
          webTorrent: this.convertToTransportable(webTorrent),
          paused: this.pausedMap.get(webTorrent.infoHash) ?? true
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
  req.torrent.submit(req.body as FeedResult);

  formatAPIResponse(res, {
    submitted: true
  });
});

// This route should be used to only initialize the torrent.
// That is, add torrent to the client, but not allow it to connect it to peers.
TorrentRouter.post("/init", (req: express.Request, res: express.Response) => {
  req.torrent.submit(req.body as FeedResult, true);

  formatAPIResponse(res, {
    init: true
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

TorrentRouter.get("/", async (req: express.Request, res: express.Response) => {
  const downloadsRepository = req.db.getRepository(Downloads);
  const runningDownloads = await downloadsRepository.find({ relations: ['details'] });

  res.json(runningDownloads);
});

TorrentRouter.post("/pause", (req: express.Request, res: express.Response) => {
  req.torrent.pause(req.body as ITorrent_Transportable);
  formatAPIResponse(res, {
    paused: true
  });
});

TorrentRouter.post("/resume", (req: express.Request, res: express.Response) => {
  req.torrent.resume(req.body as ITorrent_Transportable);
  formatAPIResponse(res, {
    resumed: true
  });
});

TorrentRouter.post("/delete", (req: express.Request, res: express.Response) => {
  req.torrent.delete(req.body as ITorrent_Transportable, req.query.deleteFiles);
  formatAPIResponse(res, {
    deleted: true
  });
});

export { TorrentRouter };
