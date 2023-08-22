import { makeAutoObservable } from "mobx";
import { ID } from "../ws/constants";

class UserData {
  score = 0;
  totalMatches = 0;
  playersPerMatch: string | undefined = undefined;
  session_id: ID | null = null;
  socket: WebSocket | null = null;
  username: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setSessionId(id: ID | null) {
    this.session_id = id;
  }
  setSocket(socket: WebSocket | null) {
    this.socket = socket;
  }
  setUsername(username: string | null) {
    this.username = username;
  }
  setScore(score: number) {
    this.score = score;
  }

  incrementScore() {
    this.score += 1;
  }
  incrementTotal() {
    this.totalMatches += 1;
  }

  reset() {
    this.session_id = null;
    this.username = null;
    this.score = 0;
    this.totalMatches = 0;
  }

  isEmpty() {
    return !this.session_id || !this.username;
  }
}

export default new UserData();
