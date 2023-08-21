import sendMessage from "../utils/sendMessage";
import { game } from "../db";
import { Choice, WS_METHODS, WebSocketMessage } from "./types";
import { WebSocket } from "ws";
import sendError from "../utils/sendError";
import sendUnauthorized from "../utils/sendUnauthorized";

export function handleVerify(ws: WebSocket, message: WebSocketMessage) {
  if (!message.id || !message.username) {
    sendError(
      ws,
      400,
      "Bad request: Session ID and/or username is not provided."
    );
  }

  const user1 = game.sessions.findBySessionId(message.id);
  const user2 = game.sessions.findByUsername(message.username);

  if (!user1 || !user2 || user1 !== user2) {
    sendUnauthorized(ws);
  }

  if (message.match_id) {
    const match = game.matches.find((val) => val.match_id == message.match_id);
    if (!match || !match.players.includes(user1)) {
      sendUnauthorized(ws);
    }
  }
}

export function handleEnqueue(ws: WebSocket, message: WebSocketMessage) {
  if (!message.id) {
    sendError(ws, 400, "Bad request: Session ID is not provided.");
    return;
  }
  if (game.enqueue(message.id)) {
    console.log("Enqueued user " + message.id);
    sendMessage(ws, {
      method: WS_METHODS.ENQUEUE,
    });
  } else {
    console.log("Failed to enqueue user " + message.id);
    sendError(
      ws,
      400,
      "Bad request: You are not in an active session - Log in again."
    );
  }
}

export function handleDequeue(ws: WebSocket, message: WebSocketMessage) {
  if (!message.id) {
    sendError(ws, 400, "Bad request: Session ID is not provided.");
    return;
  }
  game.dequeue(message.id);
  console.log("Dequeued user " + message.id);
  sendMessage(ws, {
    method: WS_METHODS.DEQUEUE,
  });
}

export function handleRegister(ws: WebSocket, message: WebSocketMessage) {
  if (!message.id || !message.username) {
    sendError(
      ws,
      400,
      "Bad request: Session ID and/or Username is not provided."
    );
    return;
  }
  const result = game.sessions.registerSession(
    ws,
    message.id,
    message.username
  );
  if (result) {
    console.log("Registered user session socket for session " + message.id);
    sendMessage(ws, {
      method: WS_METHODS.REGISTER,
      id: result.session_id,
      username: result.username,
    });
  } else {
    console.log("Registration failed for session " + message.id);
  }
}

export function handleDestroy(ws: WebSocket, message: WebSocketMessage) {
  game.removeBySocket(ws);
  console.log("Removed session for user " + message.id);
}

export function handleSubmit(ws: WebSocket, message: WebSocketMessage) {
  if (!(message.match_id && message.id)) {
    sendError(
      ws,
      400,
      "Bad request: Match ID and/or Session ID is not provided."
    );
    return;
  }

  game.setPlayerChoice(
    message.match_id,
    message.id,
    (message.message as Choice | "") || null
  );
}

export function handleRetry(ws: WebSocket, message: WebSocketMessage) {
  if (!message.id || !message.match_id) {
    sendError(
      ws,
      400,
      "Bad request: Session ID and/or Match ID is not provided."
    );
    return;
  }
  game.retryMatch(ws, message.match_id, message.id);
}

export function handleRetryReject(ws: WebSocket, message: WebSocketMessage) {
  if (!(message.match_id && message.id)) {
    sendError(
      ws,
      400,
      "Bad request: Match ID and/or Valid selected choice is not provided."
    );
    return;
  }
  game.rejectRetry(ws, message.match_id, message.id);
}

export function handleRetryAccept(ws: WebSocket, message: WebSocketMessage) {
  if (!(message.match_id && message.id)) {
    sendError(
      ws,
      400,
      "Bad request: Match ID and/or Valid selected choice is not provided."
    );
    return;
  }
  game.acceptRetry(ws, message.match_id, message.id);
}
