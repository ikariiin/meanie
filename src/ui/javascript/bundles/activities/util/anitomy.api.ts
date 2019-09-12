import {API_HEADERS, HOST} from "../../forms/util/api";
import {AnitomyParsedTitle} from "../../../../../behind/modules/anitomy";

export async function parseAnimeTitle(title: string): Promise<AnitomyParsedTitle> {
  const response = await fetch(`${HOST}/anitomy/${encodeURIComponent(title)}`, API_HEADERS);

  return response.json();
}