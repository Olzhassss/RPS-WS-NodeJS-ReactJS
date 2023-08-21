import { WebSocket } from "ws";
import { WS_METHODS } from "../ws/types";
import sendMessage from "./sendMessage";

export default function sendError(
  socket: WebSocket,
  status: number,
  text: string
) {
  return sendMessage(socket, {
    method: WS_METHODS.ERROR,
    message: `Error ${status}: ${text}`,
  });
}
