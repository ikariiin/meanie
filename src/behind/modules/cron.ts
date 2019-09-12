import {Connection} from "typeorm";
import {Feed, IFeed} from "../entitiy/feed";
import {Search} from "./search";
import {FeedResult} from "../../ui/javascript/bundles/display/components/result-box";
import {Downloads} from "../entitiy/downloads";
import {diff} from "deep-diff";
import {Settings} from "../entitiy/settings";

export class Cron {
  private dbConnection: Connection;
  private feeds: Array<Feed> = [];

  constructor(dbConnection: Connection) {
    this.dbConnection = dbConnection;
  }

  public async start(): Promise<void> {
    this.feeds = await this.dbConnection.mongoManager.find(Feed);
    const pollRate = parseInt(
      (await this.dbConnection.mongoManager.find(Settings, { name: "general.pollRate" }))[0].value, // Get the first result from the query and retrieve the value
      10
    );

    setInterval(() => {
      this.poll();
    }, pollRate * 1000);
  }

  protected static diff(previous: Downloads[], current: Downloads[]): Downloads[] {
    const perfectedPrevious = previous.map(item => item.details.torrentLink);
    const perfectedCurrent = current.map(item => item.details.torrentLink);

    const newTorrents = diff(perfectedCurrent, perfectedPrevious);
    if(!newTorrents) return [];

    // @ts-ignore
    return newTorrents.map((newTorrent) => current[newTorrent.index]);
  }

  protected async poll(): Promise<void> {
    this.feeds.forEach(async (feed) => {
      // The logic for diffing is to perform a search and then diffing between the stored list and the results
      const downloadedList = await this.dbConnection.mongoManager.find(Downloads, { feedURL: feed.url });

      const search = new Search("");
      const rawCurrentList = (await search.process(feed.url)).list;
      const currentList = this.convertListToDownloads(rawCurrentList, feed.url);
      const newTorrents = Cron.diff(downloadedList, currentList);

      // Now we need to add these torrents to our instance of Torrent
      // TODO: What I haven't figured out yet is why is there no way to have fsLink specified by users lmao
      // TODO: gotta make a settings table
    });
  }

  private convertListToDownloads(list: Array<FeedResult>, url: string): Array<Downloads> {
    return list.map(item => {
      const downloads = new Downloads();
      downloads.feedURL = url;
      downloads.details = item;
      downloads.fsLink = "dummy";

      return downloads;
    });
  }

  public async add({ url }: IFeed): Promise<void> {
    const feed = new Feed();
    feed.url = url;

    await this.dbConnection.mongoManager.save(feed);
    this.feeds.push(feed);

    // Now we do need to get a list of the items available in the feed for now and chuck it in the collection for
    // downloaded stuff.
    const search = new Search("");
    const list = (await search.process(url)).list;
    const downloads = this.convertListToDownloads(list, url);

    await this.dbConnection.mongoManager.save(downloads);
  }
}