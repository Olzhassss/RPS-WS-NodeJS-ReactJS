import match from "../stores/match";
import { WS_METHODS, WebSocketMessage } from "./constants";
import { WSHandler } from "./handlers";

export function messageHandler(message: WebSocketMessage, ws: WebSocket) {
  // console.log("Received = ");
  // console.log(message);

  const Handler = new WSHandler(ws, message);
  switch (message.method) {
    case WS_METHODS.REGISTER:
      Handler.register();
      break;
    case WS_METHODS.ENQUEUE:
      console.log("Enqueued!");
      break;
    case WS_METHODS.DEQUEUE:
      console.log("Dequeued!");
      break;
    case WS_METHODS.PREPARE:
      Handler.prepare();
      break;
    case WS_METHODS.COUNTDOWN:
      match.setCountdown(Number(message.message) || Infinity);
      break;
    case WS_METHODS.SUBMIT:
      Handler.submit();
      break;
    case WS_METHODS.RESULT:
      Handler.result();
      break;
    case WS_METHODS.ERROR:
      console.error(message.message);
      alert(message.message);
      break;
    case WS_METHODS.UNAUTHORIZED:
      console.error(message.message || "Unauthorized.");
      window.location.pathname = "/";
      // ws.dispatchEvent(new Event(WS_METHODS.UNAUTHORIZED)); // Does not work.
      break;
    case WS_METHODS.RETRY:
      Handler.retry();
      break;
    case WS_METHODS.RETRY_REJECT:
      Handler.retryReject();
      break;
    default:
      console.error("Unknown method received. Message:");
      console.log(message);
      break;
  }
}
