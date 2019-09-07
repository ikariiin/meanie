import {Connection} from "typeorm";
import {Feed, IFeed} from "../entitiy/feed";

export class Cron {
  private dbConnection: Connection;
  private feeds: Array<Feed> = [];

  constructor(dbConnection: Connection) {
    this.dbConnection = dbConnection;
  }

  public async start(): Promise<void> {
    this.feeds = await this.dbConnection.mongoManager.find(Feed);
  }

  public async add({ url }: IFeed): Promise<any> {
    const feed = new Feed();
    feed.url = url;

    await this.dbConnection.mongoManager.save(feed);

    this.feeds.push(feed);
  }
}