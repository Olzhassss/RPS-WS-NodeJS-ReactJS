import { WebSocket } from "ws";
import { ID, WS_METHODS } from "./../ws/types";
import sendMessage from "./sendMessage";

export default function sendReject(
  socket: WebSocket,
  match_id: ID,
  message: string
) {
  return sendMessage(socket, {
    method: WS_METHODS.RETRY_REJECT,
    match_id,
    message,
  });
}
