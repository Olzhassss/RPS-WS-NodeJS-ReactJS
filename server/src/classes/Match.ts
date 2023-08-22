import { randomUUID } from "crypto";
import { setInterval } from "node:timers/promises";
import { setTimeout } from "timers/promises";
import { MATCH_SUBMIT_DELAY } from "../";
import sendMessage from "../utils/sendMessage";
import sendReject from "../utils/sendReject";
import { Choice, ID, WS_METHODS, WebSocketMessage } from "../ws/types";
import { PlayerSession } from "./PlayerSession";

// TODO: connect model to database table and get match_id from there.
export class Match {
  players: Array<PlayerSession> = [];
  match_id: ReturnType<typeof randomUUID>;
  private status: "IDLE" | "STARTED" | "AWAITING" | "FINISHED" | "CLOSED";
  timestamp: EpochTimeStamp;
  result: string[] = [];
  retry_status: "NONE" | "PROCESSING" | "ACCEPTED" | "REJECTED";
  retry_accepted: Set<string>;

  constructor(players: Array<PlayerSession>) {
    this.players = players;
    this.match_id = randomUUID();
    this.status = "IDLE";
    this.retry_status = "NONE";
    this.retry_accepted = new Set();
  }

  /**
   * start
   */
  public async start() {
    if (this.status != "IDLE") {
      console.warn("Denied request to start a match that is not IDLE.");
      return;
    }
    this.broadcastToPlayers({
      method: WS_METHODS.PREPARE,
      match_id: this.match_id,
      players: this.players.map((val) => val.username),
    });
    this.status = "STARTED";
    const interval = 1000;
    let countdown = 3;

    for await (const _ of setInterval(interval)) {
      console.log("Countdown = " + countdown);
      if (countdown == 0) {
        break;
      }

      this.broadcastToPlayers({
        method: WS_METHODS.COUNTDOWN,
        message: String(countdown),
      });
      countdown--;
    }

    await this.awaitResults();
  }

  /**
   * awaitResults
   */
  public async awaitResults() {
    if (this.status != "STARTED") {
      console.warn("Denied request to await a match that is not STARTED.");
      return;
    }
    console.log("Awating results for match = " + this.match_id);
    this.status = "AWAITING";
    this.broadcastToPlayers({ method: WS_METHODS.SUBMIT });

    await setTimeout(MATCH_SUBMIT_DELAY);
    this.conclude();
  }

  /**
   * conclude
   */
  public conclude() {
    if (this.status != "AWAITING") {
      console.warn("Denied request to conclude a match that is not STARTED.");
      return;
    }

    console.log("Finishing match = " + this.match_id);
    this.timestamp = Date.now();
    this.status = "FINISHED";
    this.calculate();
    this.sendResults();
  }

  /**
   * sendResults
   *
   * TODO: send timestamp along with other data & connect with a DB.
   */
  public sendResults() {
    if (this.status != "FINISHED") {
      console.warn(
        "Denied request to send results for a match that is not FINISHED."
      );
      return;
    }

    console.log("Sending results to players");

    const usernames = this.players.map((p) => p.username);
    this.players.forEach((p) => {
      let res = "Defeat";

      if (!this.result) {
        res = "Draw";
      } else if (this.result.includes(p.username)) {
        res = "Victory";
      }

      sendMessage(p.socket, {
        method: WS_METHODS.RESULT,
        message: res,
        match_id: this.match_id,
        players: usernames,
      });

      p.choice = null;
    });

    this.status = "CLOSED";
  }

  /**
   * setPlayerChoice
   */
  public setPlayerChoice(session_id: ID, choice: Choice | null) {
    if (this.status == "AWAITING") {
      const i = this.players.findIndex((val) => val.session_id == session_id);
      if (i != -1) {
        console.log(`Setting player ${session_id} choice as = ${choice}`);
        this.players[i].choice = choice;
      } else {
        console.error(
          "Unable to set player choice: Invalid session_id = " + session_id
        );
      }
    }
  }

  /**
   * Sets this.result to the array of usernames of the winners.
   */
  private calculate() {
    const ChoiceMap = new Map();
    ChoiceMap.set(Choice.ROCK, 0);
    ChoiceMap.set(Choice.PAPER, 1);
    ChoiceMap.set(Choice.SCISSORS, 2);

    let isDraw = false;

    const fisrtAdequateChoicePlayer = this.players.find((p) =>
      Object.values(Choice).includes(p.choice)
    );
    let winnerChoice: Choice;
    if (!fisrtAdequateChoicePlayer) {
      // No adequate choice selected, i.e. everyone submitted null
      isDraw = true;
    } else {
      winnerChoice = fisrtAdequateChoicePlayer.choice;
      let winnerChangeCount = 1;

      this.players.forEach((p) => {
        if (winnerChangeCount == 3) {
          isDraw = true;
          return;
        }
        const { choice } = p;

        const result = choice
          ? (3 + ChoiceMap.get(choice) - ChoiceMap.get(winnerChoice)) % 3
          : 0;
        if (result == 1) {
          // new winner
          winnerChoice = choice;
          winnerChangeCount++;
        }
      });
    }

    if (isDraw) {
      // a draw
      this.result = null;
      console.log(`Winners for match ${this.match_id} are = None (draw) `);
      return;
    }
    // not a draw
    const winners = this.players
      .filter((p) => p.choice == winnerChoice)
      .map((p) => p.username);
    this.result = winners;

    console.log(
      `Winners for match ${this.match_id} are = ${winners} (${winnerChoice})`
    );
  }

  private broadcastToPlayers(message: Partial<WebSocketMessage>) {
    this.players.forEach((p) => {
      if (p.isOnline()) {
        sendMessage(p.socket, message);
      }
    });
  }

  /**
   * sendRetry
   */
  public sendRetry(session_id: ID) {
    if (this.retry_status != "NONE") {
      console.warn("Denied match retry since retry status is not NONE.");
      return false;
    }
    console.log("Sending retry requests");
    this.retry_status = "PROCESSING";

    const initiator = this.players.find((val) => val.session_id == session_id);
    if (!initiator) {
      console.warn(
        "Denied match retry reject since initiator did not participate."
      );
      return false;
    }

    this.acceptRetry(session_id);

    let offline = false;
    this.players
      .filter((val) => val != initiator)
      .forEach((p) => {
        if (!p.isOnline()) {
          offline = true;
          return;
        }

        sendMessage(p.socket, {
          method: WS_METHODS.RETRY,
          message: initiator.username,
          match_id: this.match_id,
        });
      });

    if (offline) {
      this.broadcastToPlayers({
        method: WS_METHODS.RETRY_REJECT,
      });
      this.retry_status = "REJECTED";
      return false;
    }
    return true;
  }

  /**
   * rejectRetry
   */
  public rejectRetry(session_id: ID) {
    if (this.retry_status != "PROCESSING" && this.retry_status != "NONE") {
      console.warn(
        "Denied match retry reject since retry status is not PROCESSING or NONE."
      );
      return false;
    }
    const initiator = this.players.find((val) => val.session_id == session_id);
    if (!initiator) {
      console.warn(
        "Denied match retry reject since the initiator did not participate."
      );
      return false;
    }

    console.log("Player " + initiator.username + " rejected retry.");
    this.sendReject("Player " + initiator.username + " rejected retry.");
    this.retry_status = "REJECTED";
    return true;
  }

  /**
   * acceptRetry
   */
  public acceptRetry(session_id: ID) {
    if (this.retry_status != "PROCESSING") {
      console.warn(
        "Denied match retry accept since retry status is not PROCESSING."
      );
      return false;
    }
    const player = this.players.find((val) => val.session_id == session_id);
    if (!player) {
      console.warn(
        "Denied match retry accept since the player did not participate."
      );
      return false;
    }
    if (this.retry_accepted.has(player.username)) {
      console.warn(
        "Denied match retry accept since the player already accepted."
      );
      return false;
    }
    console.log("Player " + player.username + " accepted retry.");

    this.retry_accepted.add(player.username);
    return true;
  }

  /**
   * allAccepted
   */
  public allAccepted() {
    return this.retry_accepted.size == this.players.length;
  }

  /**
   * sendReject
   */
  public sendReject(message: string) {
    this.retry_accepted.forEach((username) => {
      const p = this.players.find((val) => val.username == username);
      sendReject(p.socket, this.match_id, message);
    });
  }
}
