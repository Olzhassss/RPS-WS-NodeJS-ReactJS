import history from "../stores/history";
import match, { MatchResult, MatchState } from "../stores/match";
import userdata from "../stores/userdata";
import { WS_METHODS, WebSocketMessage } from "./constants";
import { WSHandler } from "./handlers";
import { sendMessage } from "./utils";

export function messageHandler(message: WebSocketMessage, ws: WebSocket) {
  console.log("Received = ");
  console.log(message);

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
      if (!message.players?.length || !message.match_id) {
        console.error("Got wrong response parameters for method PREPARE");
        break;
      }
      match.reset();
      match.setPlayers(message.players);
      match.setMatchId(message.match_id);
      match.setState(MatchState.STARTED);
      ws.dispatchEvent(new Event(WS_METHODS.PREPARE));
      // throw redirect("/" + userdata.username + "/" + message.message);
      break;
    case WS_METHODS.COUNTDOWN:
      match.setCountdown(Number(message.message) || Infinity);
      break;
    case WS_METHODS.SUBMIT:
      match.setState(MatchState.AWAITING);
      match.setCountdown(Infinity);
      sendMessage({
        method: WS_METHODS.SUBMIT,
        message: match.choice ?? "",
        match_id: match.match_id ?? undefined,
        id: userdata.session_id ?? undefined,
      });
      break;
    case WS_METHODS.RESULT:
      if (!message.players?.length || !message.match_id || !message.match_id) {
        console.error("Got wrong response parameters for method PREPARE");
        break;
      }
      const res =
        Object.values(MatchResult).find(
          (val) => val == (message.message as MatchResult)
        ) || MatchResult.UNKNOWN;
      match.setResult(res);
      if (match.result == MatchResult.VICTORY) {
        userdata.incrementScore();
      }
      match.setState(MatchState.FINISHED);
      history.saveMatch(message.match_id, message.players, res);
      break;
    case WS_METHODS.ERROR:
      console.error(message.message);
      alert(message.message);
      break;
    case WS_METHODS.UNAUTHORIZED:
      console.error(message.message || "Unauthorized.");
      ws.dispatchEvent(new Event(WS_METHODS.UNAUTHORIZED));
      break;
    case WS_METHODS.RETRY:
      if (match.match_id != message.match_id) {
        sendMessage({
          method: WS_METHODS.RETRY_REJECT,
          id: userdata.session_id ?? undefined,
          match_id: match.match_id ?? undefined,
        });
        break;
      }
      if (confirm(`Player ${message.message} wants to retry! Do you accept?`)) {
        sendMessage({
          method: WS_METHODS.RETRY_ACCEPT,
          id: userdata.session_id ?? undefined,
          match_id: match.match_id ?? undefined,
        });
      } else {
        match.disableRetry();
        sendMessage({
          method: WS_METHODS.RETRY_REJECT,
          id: userdata.session_id ?? undefined,
          match_id: match.match_id ?? undefined,
        });
      }
      break;
    case WS_METHODS.RETRY_REJECT:
      if (match.match_id != message.match_id) {
        console.log("Retry invite was rejected.");
        break;
      }
      match.disableRetry();
      alert("Match retry was rejected. " + message.message ?? "");
      break;
    default:
      console.error("Unknown method received. Message:");
      console.log(message);
      break;
  }
}
