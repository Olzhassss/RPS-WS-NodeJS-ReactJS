import { randomUUID } from "crypto";
import { Choice } from "../ws/types";
import { WebSocket } from "ws";

export class PlayerSession {
  session_id: ReturnType<typeof randomUUID>;
  username: string;
  socket: WebSocket;
  choice: Choice | null = null;

  constructor(
    username: string,
    socket: WebSocket,
    session_id: ReturnType<typeof randomUUID> = null
  ) {
    if (!session_id) {
      this.session_id = randomUUID();
    } else {
      this.session_id = session_id;
    }
    this.username = username;
    this.socket = socket;
  }

  /**
   * Attach a websocket connection to a player
   */
  public connect(socket: WebSocket) {
    if (this.socket) {
      this.socket.close(1005, "Establishing new connection.");
    }
    this.socket = socket;
  }

  public isConnected() {
    return !!this.socket;
  }

  public isOnline() {
    return this.isConnected() && this.socket.readyState == WebSocket.OPEN;
  }
}
