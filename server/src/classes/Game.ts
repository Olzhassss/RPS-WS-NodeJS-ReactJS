import { Choice, ID } from "./../ws/types";
import { WebSocket } from "ws";
import { MATCH_PLAYERS_NUMBER } from "../index";
import { Match } from "./Match";
import { Queue } from "./Queue";
import { Sessions } from "./Sessions";
import { randomUUID } from "crypto";
import { PlayerSession } from "./PlayerSession";
import sendReject from "../utils/sendReject";

export class Game {
  queue: Queue;
  sessions: Sessions;
  matches: Array<Match> = [];
  closed_matches: Array<Match> = [];

  constructor() {
    this.queue = new Queue();
    this.sessions = new Sessions();
  }

  /**
   * reset
   */
  public reset() {
    this.sessions.reset();
    this.queue.reset();
    this.matches = [];
    this.closed_matches = [];
  }

  /**
   * enqueue
   */
  public enqueue(session_id: string) {
    const player = this.sessions.findBySessionId(session_id);
    if (!player) {
      return false;
    }
    const queue_length = this.queue.enqueue(player);
    if (queue_length == MATCH_PLAYERS_NUMBER) {
      this.startMatch();
    }
    return true;
  }

  /**
   * dequeue
   */
  public dequeue(session_id: string) {
    return this.queue.removeBySessionId(session_id);
  }

  /**
   * startMatch
   */
  private startMatch(players?: PlayerSession[]) {
    if (!players) {
      players = this.queue.popPlayers(MATCH_PLAYERS_NUMBER);
    }
    const match = new Match(players);
    this.matches.push(match);
    match.start().then(() => {
      this.matches = this.matches.filter((val) => val !== match);
      this.closed_matches.push(match);
    });
  }

  /**
   * getActiveMatch
   */
  public getActiveMatch(match_id: ID) {
    return this.matches.find((val) => val.match_id == match_id);
  }

  /**
   * getClosedMatch
   */
  public getClosedMatch(match_id: ID) {
    return this.closed_matches.find((val) => val.match_id == match_id);
  }

  /**
   * setPlayerChoice
   */
  public setPlayerChoice(
    match_id: ReturnType<typeof randomUUID>,
    session_id: ID,
    choice: Choice | null
  ) {
    const match = this.getActiveMatch(match_id);
    if (match) {
      match.setPlayerChoice(session_id, choice);
    } else {
      console.error("Match not found to set player choice!");
    }
  }

  /**
   * removeBySocket
   */
  public removeBySocket(ws: WebSocket) {
    this.queue.removeBySocket(ws);
    this.sessions.removeBySocket(ws);
  }

  /**
   * retryMatch
   */
  public retryMatch(ws: WebSocket, match_id: ID, session_id: ID) {
    const match = this.getClosedMatch(match_id);
    if (!match) {
      console.error("Match not found to retry!");
      sendReject(ws, match_id, "Match not found to retry!");
      return;
    }

    if (!match.sendRetry(session_id)) {
      sendReject(ws, match.match_id, "Failed to send retry requests.");
      return;
    }

    // Timeout for sending accept or reject replies
    setTimeout(() => {
      if (match.retry_status == "PROCESSING") {
        console.log("Match retry was not accepted.");
        match.retry_status = "REJECTED";
        match.sendReject("Retry accept timeout reached.");
      }
    }, 15000);
  }

  /**
   * rejectRetry
   */
  public rejectRetry(ws: WebSocket, match_id: ID, session_id: ID) {
    const match = this.getClosedMatch(match_id);
    if (!match) {
      console.error("Match not found to retry!");
      sendReject(ws, match_id, "Match not found to retry!");
      return;
    }
    match.rejectRetry(session_id);
  }

  /**
   * acceptRetry
   */
  public acceptRetry(ws: WebSocket, match_id: ID, session_id: ID) {
    const match = this.getClosedMatch(match_id);
    if (!match) {
      console.error("Match not found to retry!");
      sendReject(ws, match_id, "Match not found to retry!");
      return;
    }
    if (match.acceptRetry(session_id) && match.allAccepted()) {
      console.log("All players accepted retry.");
      match.retry_status = "ACCEPTED";
      this.startMatch(match.players);
    }
  }
}
