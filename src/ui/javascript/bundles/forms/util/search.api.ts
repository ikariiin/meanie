import {API_HEADERS, HOST} from "./api";
import {ISearchResult} from "../../../../../behind/modules/search";

export async function searchAPI(term: string): Promise<ISearchResult> {
  const response = await fetch(`${HOST}/search/${encodeURIComponent(term)}`, API_HEADERS);
  return response.json();
}