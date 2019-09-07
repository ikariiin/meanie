import {v4 as uuid} from "uuid";

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

  public subscribe(type: string) {}

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