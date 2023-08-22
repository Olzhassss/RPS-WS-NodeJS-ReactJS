import history from "../stores/history";
import match, { MatchResult, MatchState } from "../stores/match";
import userdata from "../stores/userdata";
import { WS_METHODS, WebSocketMessage } from "./constants";
import { sendMessage } from "./utils";

export class WSHandler {
  private ws: WebSocket;
  private message: WebSocketMessage;

  constructor(ws: WebSocket, message: WebSocketMessage) {
    this.ws = ws;
    this.message = message;
  }

  /**
   * register
   */
  public register() {
    const { id, username, message } = this.message;

    if (!id || !username) {
      console.error("Got wrong response parameters for method REGISTER");
      return;
    }
    userdata.setSessionId(id);
    userdata.setUsername(username);
    userdata.playersPerMatch = message;

    this.ws.dispatchEvent(new Event(WS_METHODS.REGISTER));
  }

  /**
   * prepare
   */
  public prepare() {
    const { players, match_id } = this.message;
    if (!players?.length || !match_id) {
      console.error("Got wrong response parameters for method PREPARE");
      return;
    }
    match.reset();
    match.setPlayers(players);
    match.setMatchId(match_id);
    match.setState(MatchState.STARTED);
    this.ws.dispatchEvent(new Event(WS_METHODS.PREPARE));
  }

  /**
   * submit
   */
  public submit() {
    match.setState(MatchState.AWAITING);
    match.setCountdown(Infinity);
    sendMessage({
      method: WS_METHODS.SUBMIT,
      message: match.choice ?? "",
      match_id: match.match_id ?? undefined,
      id: userdata.session_id ?? undefined,
    });
  }

  /**
   * result
   */
  public result() {
    const { players, match_id, message } = this.message;
    if (!players?.length || !match_id || !match_id) {
      console.error("Got wrong response parameters for method PREPARE");
      return;
    }
    const res =
      Object.values(MatchResult).find(
        (val) => val == (message as MatchResult)
      ) || MatchResult.UNKNOWN;
    match.setResult(res);
    if (match.result == MatchResult.VICTORY) {
      userdata.incrementScore();
    }
    userdata.incrementTotal();
    match.setState(MatchState.FINISHED);
    history.saveMatch(match_id, players, res);
  }

  /**
   * retry
   */
  public retry() {
    const { match_id, message } = this.message;
    if (match.match_id != match_id) {
      sendMessage({
        method: WS_METHODS.RETRY_REJECT,
        id: userdata.session_id ?? undefined,
        match_id: match.match_id ?? undefined,
      });
      return;
    }
    if (confirm(`Player ${message} wants to retry! Do you accept?`)) {
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
  }

  /**
   * retryReject
   */
  public retryReject() {
    const { match_id, message } = this.message;
    if (match.match_id != match_id) {
      console.log("Retry invite was rejected.");
      return;
    }
    match.disableRetry();
    alert("Match retry was rejected: " + message ?? "Sorry, I don't know why.");
  }
}
