import * as WebSocket from "ws";

export enum WebSocketState {
  OPEN,
  CLOSED,
  NOT_STARTED
}

export interface ISingleRequest {
  type: "SingleRequest"
}
export interface ISubscription {
  type: "Subscription"
}

export class WebSocketHandler {
  private websocket: WebSocket;
  private state: WebSocketState = WebSocketState.NOT_STARTED;

  constructor(ws: WebSocket) {
    this.websocket = ws;
  }

  private closeWebSocket(): void {
    this.state = WebSocketState.CLOSED;
    // Unsubscribe from all the subscriptions
  }

  private processRequest(request: ISingleRequest) {
    //
  }

  private initializeSubscription(subscriptionDetails: ISubscription): void {
    //
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