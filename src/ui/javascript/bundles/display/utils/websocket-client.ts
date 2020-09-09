import { v4 as uuid } from "uuid";
import { TorrentsWatchResponse } from "../../../../../behind/modules/websocket";

export class WebSocketClient {
  private port: string;
  private ws: WebSocket;

  constructor(port: string) {
    this.port = port;
    this.ws = new WebSocket(`ws://localhost:${port}/websocket`);
  }

  public addOpenHandler(handler: Function) {
    this.ws.addEventListener("open", () => handler());
  }

  public subscribe(subscription: string, handler: Function) {
    const instanceUUID = uuid();
    this.ws.send(JSON.stringify({
      uuid: instanceUUID,
      type: "Subscription",
      for: subscription
    }));

    this.ws.addEventListener("message", (event) => {
      const formattedMessage: TorrentsWatchResponse = JSON.parse(event.data);
      if(formattedMessage.uuid === instanceUUID) {
        handler(formattedMessage);
      }
    })
  }

  public send(data: any, handler: (data: any) => void) {
    const instanceUUID = uuid();
    this.ws.send(JSON.stringify({
      uuid: instanceUUID,
      type: "SingleRequest",
      data
    }));

    this.ws.addEventListener("message", (message) => {
      const data = JSON.parse(message.data);
      if(data.uuid === instanceUUID) {
        handler(data);
      }
    });
  }
}