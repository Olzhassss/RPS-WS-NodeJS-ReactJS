import userdata from "../stores/userdata";
import { messageHandler } from "./messageHandler";
import { BACKEND_URL_WS, ID, WS_METHODS, WebSocketMessage } from "./constants";

export function sendDestroy(session_id: ID) {
  console.log("Trying to send DESTROY request.");
  sendMessage({
    method: WS_METHODS.DESTROY,
    id: session_id,
  });
}

export function sendMessage(msg: Partial<WebSocketMessage>) {
  if (!userdata.socket || !(userdata.socket.readyState == WebSocket.OPEN)) {
    console.error("WebSocket connection is not established!");
    alert(
      "WebSocket connection is not established. Wait a little or reload the page."
    );
    return;
  }
  const data = JSON.stringify(msg);

  // console.log("Sending = ");
  // console.log(msg);

  userdata.socket.send(data);
}

export function startWSConnetion(retry = false) {
  if (userdata.socket && userdata.socket.readyState <= 1) {
    return userdata.socket;
  }

  const ws = new WebSocket(BACKEND_URL_WS);
  userdata.setSocket(ws);

  ws.onmessage = (event) =>
    messageHandler(JSON.parse(event.data as string) as WebSocketMessage, ws);

  ws.onopen = () => console.info("WS connection established");

  ws.onerror = (event) => {
    console.error(event);
  };

  ws.onclose = () => {
    console.log("Closing connection.");
    if (retry) {
      console.log("Trying to reconnect...");
      startWSConnetion(retry);
      // throw redirect("/");
    }
  };

  return ws;
}
