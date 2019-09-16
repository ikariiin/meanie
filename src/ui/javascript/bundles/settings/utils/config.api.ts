import {API_HEADERS, HOST} from "../../forms/util/api";
import {Settings} from "../../../../../behind/entitiy/settings";

export async function fetchConfig(key: string): Promise<Settings> {
  const response = await fetch(`${HOST}/settings/${key}`, API_HEADERS);
  return response.json();
}