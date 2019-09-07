import {API_HEADERS, HOST} from "./api";

export async function submitFeed(url: string): Promise<any> {
  const response = await fetch(`${HOST}/feeds/add`, {
    ...API_HEADERS,
    method: "POST",
    body: JSON.stringify({ url })
  });

  return response.json();
}