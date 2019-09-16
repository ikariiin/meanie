import * as WebSocket from "ws";
import {ITorrent, Torrent} from "./torrent";
import {Connection} from "typeorm";

export enum WebSocketState {
  OPEN,
  CLOSED,
  NOT_STARTED
}

export interface ISingleRequest {
  type: "SingleRequest"
}
export interface ISubscription {
  type: "Subscription",
  for: "torrents"|string;
  uuid: string;
}

export interface TorrentsWatchResponse {
  torrents: Array<ITorrent>,
  uuid: string;
}

export class WebSocketHandler {
  private websocket: WebSocket;
  private state: WebSocketState = WebSocketState.NOT_STARTED;
  private torrent: Torrent;
  private dbConnection: Connection;
  private timeouts: Array<NodeJS.Timeout> = [];

  constructor(ws: WebSocket, torrent: Torrent, db: Connection) {
    this.websocket = ws;
    this.torrent = torrent;
    this.dbConnection = db;
  }

  private closeWebSocket(): void {
    this.state = WebSocketState.CLOSED;
    // Unsubscribe from all the subscriptions
  }

  private processRequest(request: ISingleRequest) {
    //
  }

  private shutOffTimeouts(): void {
    this.timeouts.forEach(timeout => clearInterval(timeout));
  }

  private initializeSubscription(subscriptionDetails: ISubscription): void {
    if(subscriptionDetails.for === "torrents") {
      this.timeouts.push(this.torrent.watchAll((torrents) => {
        if(this.websocket.readyState === this.websocket.CLOSED) {
          this.shutOffTimeouts(); return;
        }

        this.websocket.send(JSON.stringify({
          torrents,
          uuid: subscriptionDetails.uuid
        }))
      }));
    }
  }

  private handleNewMessage(message: WebSocket.Data): void {
    if(typeof message !== "string") return;

    const data: ISingleRequest|ISubscription = JSON.parse(message);
    if(data.type === "SingleRequest") {
      this.processRequest(data);
    }
    if(data.type === "Subscription") {
      this.initializeSubscription(data);
    }
  }

  public attachHandlers(): void {
    this.websocket.on("open", () => this.state = WebSocketState.OPEN);
    this.websocket.on("close", () => this.closeWebSocket());
    this.websocket.on("message", (data) => this.handleNewMessage(data))
  }
}