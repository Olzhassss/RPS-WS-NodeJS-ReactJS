import userdata from "../stores/userdata";
import { WS_METHODS, WebSocketMessage } from "./constants";

export class WSHandler {
  private ws: WebSocket;
  private message: WebSocketMessage;

  constructor(ws: WebSocket, message: WebSocketMessage) {
    this.ws = ws;
    this.message = message;
  }

  /**
   * register
   */
  public register() {
    const { id, username } = this.message;

    if (!id) {
      console.error("Got wrong response parameters for method REGISTER");
      return;
    }
    userdata.setSessionId(id);
    userdata.setUsername(username ?? null);
    console.log("Register successful.");
    this.ws.dispatchEvent(new Event(WS_METHODS.REGISTER));
  }
}
