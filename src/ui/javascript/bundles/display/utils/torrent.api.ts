import {FeedResult} from "../components/result-box";
import {API_HEADERS, HOST} from "../../forms/util/api";

export async function submitTorrent(torrent: FeedResult) {
  const response = await fetch(`${HOST}/torrents/new`, {
    ...API_HEADERS,
    method: "POST",
    body: JSON.stringify(torrent, null, 2)
  });

  console.log(await response.json());
}