import { randomUUID } from "crypto";

export enum WS_METHODS {
  REGISTER = "register",
  VERIFY = "verify",
  DESTROY = "destroy",
  ENQUEUE = "enqueue",
  DEQUEUE = "dequeue",
  ERROR = "error",
  PREPARE = "prepare",
  COUNTDOWN = "countdown",
  SUBMIT = "submit",
  RESULT = "result",
  RETRY = "retry",
  UNAUTHORIZED = "unauthorized",
  RETRY_REJECT = "retry_reject",
  RETRY_ACCEPT = "retry_accept",
}

export enum Choice {
  PAPER = "paper",
  SCISSORS = "scissors",
  ROCK = "rock",
}

export type WebSocketMessage = {
  method: WS_METHODS;
  username: string;
  id: ID;
  message?: string;
  players?: string[];
  match_id?: ID;
};

export type ID = ReturnType<typeof randomUUID>;
