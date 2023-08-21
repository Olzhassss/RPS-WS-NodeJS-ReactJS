import { RawData, WebSocket } from "ws";
import {
  handleDestroy,
  handleEnqueue,
  handleRegister,
  handleDequeue,
  handleSubmit,
  handleVerify,
  handleRetry,
  handleRetryReject,
  handleRetryAccept,
} from "./handlers";
import sendError from "../utils/sendError";
import { WS_METHODS, WebSocketMessage } from "./types";

export function messageHandler(ws: WebSocket, data: RawData) {
  const message = JSON.parse(data.toString()) as WebSocketMessage;
  // console.log("Received message: " + message);
  if (!message.method) {
    sendError(ws, 400, "Bad request: No method provided.");
  }

  switch (message.method) {
    case WS_METHODS.REGISTER:
      handleRegister(ws, message);
      break;
    case WS_METHODS.VERIFY:
      handleVerify(ws, message);
      break;
    case WS_METHODS.ENQUEUE:
      handleEnqueue(ws, message);
      break;
    case WS_METHODS.DEQUEUE:
      handleDequeue(ws, message);
      break;
    case WS_METHODS.DESTROY:
      handleDestroy(ws, message);
      break;
    case WS_METHODS.SUBMIT:
      handleSubmit(ws, message);
      break;
    case WS_METHODS.RETRY:
      handleRetry(ws, message);
      break;
    case WS_METHODS.RETRY_ACCEPT:
      handleRetryAccept(ws, message);
      break;
    case WS_METHODS.RETRY_REJECT:
      handleRetryReject(ws, message);
      break;
    default:
      console.error("Unknown method received. Message:");
      console.log(message);
      sendError(ws, 400, "Unknown method received.");
      break;
  }
  return;
}
