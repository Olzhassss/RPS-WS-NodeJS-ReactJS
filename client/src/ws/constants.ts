// import { randomUUID } from "crypto";

export const BACKEND_URL = import.meta.env.DEV
  ? "http://localhost:5000"
  : (import.meta.env.VITE_BACKEND_URL as string);

export const BACKEND_URL_WS = import.meta.env.DEV
  ? "ws://localhost:5000"
  : (import.meta.env.VITE_BACKEND_URL_WS as string);

/**
 *  Methods used to communicate through WebSocket connection.
 *
 */
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

export type ID = string;

export type WebSocketMessage = {
  method: WS_METHODS;
  username?: string;
  id?: ID;
  message?: string;
  players?: string[];
  match_id?: ID;
};
