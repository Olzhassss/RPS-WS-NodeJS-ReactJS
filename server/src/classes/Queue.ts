import { WebSocket } from "ws";
import { PlayerSession } from "./PlayerSession";

export class Queue {
  private queue: Array<PlayerSession> = [];

  /**
   * enqueue
   */
  public enqueue(player: PlayerSession) {
    return this.queue.push(player);
  }

  /**
   * reset
   */
  public reset() {
    this.queue = [];
  }

  /**
   * pop
   */
  public popPlayers(n: number) {
    let players = [];
    for (let i = 0; i < n; i++) {
      players.push(this.queue.pop());
    }
    return players;
  }

  /**
   * removeBySessionId
   */
  public removeBySessionId(session_id: String) {
    this.queue = this.queue.filter((val) => val.session_id != session_id);
  }

  /**
   * removeBySocket
   */
  public removeBySocket(socket: WebSocket) {
    this.queue = this.queue.filter((val) => val.socket != socket);
  }
}
