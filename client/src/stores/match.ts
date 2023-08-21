import { makeAutoObservable } from "mobx";
import { ID } from "../ws/constants";

export enum Choice {
  PAPER = "paper",
  SCISSORS = "scissors",
  ROCK = "rock",
}

export enum MatchState {
  IDLE,
  STARTED,
  AWAITING,
  FINISHED,
}

export enum MatchResult {
  VICTORY = "Victory",
  DEFEAT = "Defeat",
  DRAW = "Draw",
  UNKNOWN = "Unknown",
}

class Match {
  state: MatchState = MatchState.IDLE;
  players: string[] = [];
  countdown: number = Infinity;
  choice: Choice | null = null;
  match_id: ID | null = null;
  result: MatchResult = MatchResult.UNKNOWN;
  accepts_retries: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  setChoice(choice: Choice) {
    this.choice = choice;
  }
  setCountdown(countdown: number) {
    this.countdown = countdown;
  }
  setPlayers(players: string[]) {
    this.players = players;
  }
  setMatchId(match_id: ID) {
    this.match_id = match_id;
  }
  setResult(res: MatchResult) {
    this.result = res;
  }
  setState(state: MatchState) {
    this.state = state;
  }
  disableRetry() {
    this.accepts_retries = false;
  }

  /**
   * Does not change `state` and `match_id`
   */
  reset() {
    this.countdown = Infinity;
    this.choice = null;
    this.players = [];
    this.result = MatchResult.UNKNOWN;
    this.accepts_retries = true;
  }

  isEmpty() {
    return !this.match_id;
  }
}

export default new Match();
