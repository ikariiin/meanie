import * as express from "express";
import {formatAPIResponse} from "../util/response-formatter";
const anitomy = require("anitomyscript");

const AnitomyRouter = express.Router();

export interface AnitomyParsedTitle {
  anime_season: string; anime_title: string; anime_type: string; anime_year: string; audio_term: string;
  episode_number: string; episode_prefix: string; episode_title: string; file_extension: string;
  language: string; release_group: string; release_version: string; season_prefix: string; source: string;
  subtitles: string; video_resolution: string; volume_number: string; video_term: string;
}

AnitomyRouter.get("/:title", async (req: express.Request, res: express.Response) => {
  const title = req.params.title + ".mkv"; // Dirty little hack to make it a file than an ambiguous thing
  const parsedData = await anitomy(title);
  formatAPIResponse(res, parsedData);
});

export { AnitomyRouter };