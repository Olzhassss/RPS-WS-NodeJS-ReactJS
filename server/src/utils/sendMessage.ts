import { WebSocket } from "ws";
import { WebSocketMessage } from "./../ws/types";

export default function sendMessage(
  socket: WebSocket,
  msg: Partial<WebSocketMessage>
) {
  if (!socket || !(socket.readyState == WebSocket.OPEN)) {
    console.error("WebSocket connection is not established.");
    return false;
  }
  const data = JSON.stringify(msg);
  socket.send(data);
  return true;
}
