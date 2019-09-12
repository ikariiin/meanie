import * as express from "express";
import fetch from "node-fetch";
import {formatAPIResponse} from "../util/response-formatter";
import { parseStringPromise } from "xml2js";
import {FeedResult} from "../../ui/javascript/bundles/display/components/result-box";

export interface ISearchResult {
  list: Array<FeedResult>,
  url: string
}

export class Search {
  static SEARCH_URI = "https://nyaa.si/?page=rss&q=%term%&c=0_0&f=0";

  private readonly term: string;

  constructor(term: string) {
    this.term = term;
  }

  protected static formatList(list: any): Array<FeedResult> {
    const actualList = list.rss.channel[0].item;
    return actualList.map((item: any) => ({
      title: item["title"][0],
      torrentLink: item["link"][0],
      seeders: item["nyaa:seeders"][0],
      leechers: item["nyaa:leechers"][0],
      size: item["nyaa:size"][0],
      date: item["pubDate"][0],
      pageLink: item["guid"][0]["_"]
    }));
  }

  /**
   * Requests a RSS Feed from nyaa.si
   * @param url
   * If provided it will use the same to request nyaa
   */
  public async process(url?: string): Promise<ISearchResult> {
    const response = await fetch(
      url ? url : Search.SEARCH_URI.replace("%term%", this.term)
    );
    const xmlData = await response.text();
    const parsedList = await parseStringPromise(xmlData);
    return {
      list: Search.formatList(parsedList),
      url: Search.SEARCH_URI.replace("%term%", this.term)
    };
  }
}

const SearchRouter = express.Router();

SearchRouter.get("/:term", async (req: express.Request, res: express.Response) => {
  const term = req.params.term;
  const search = new Search(term);
  const feeds = await search.process();

  formatAPIResponse(res, feeds);
});

export { SearchRouter };