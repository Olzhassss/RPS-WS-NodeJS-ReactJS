import { WebSocket } from "ws";
import { WS_METHODS } from "../ws/types";
import sendMessage from "./sendMessage";

export default function sendUnauthorized(socket: WebSocket, message?: string) {
  return sendMessage(socket, {
    method: WS_METHODS.UNAUTHORIZED,
    message,
  });
}
