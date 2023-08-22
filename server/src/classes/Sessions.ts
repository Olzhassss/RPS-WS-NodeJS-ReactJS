import { randomUUID } from "crypto";
import { WebSocket } from "ws";
import { PlayerSession } from "./PlayerSession";
import { Token } from "./Token";

/**
 * This class meant to be used for JWT authentication and sessions control, but idea has not been implemented.
 */
export class Sessions {
  private sessions: Array<PlayerSession> = [];
  tokens: Array<Token> = [];

  /**
   * getSessions
   */
  public getSessions() {
    return this.sessions.map((val) => {
      return {
        id: val.session_id,
        username: val.username,
      };
    });
  }

  /**
   * createSession
   */
  public createToken(username: string): false | Token {
    if (this.findByUsername(username)) {
      return false;
    } else {
      const i = this.tokens.findIndex((val) => val.username == username);
      if (i != -1) {
        this.tokens[i] = new Token(username);
        return this.tokens[i];
      } else {
        const token = new Token(username);
        this.tokens.push(token);
        return token;
      }
    }
  }

  public findByUsername(username: string) {
    return this.sessions.find((val) => val.username == username);
  }

  public findBySessionId(session_id: string) {
    return this.sessions.find((val) => val.session_id == session_id);
  }

  /**
   * registerSession
   */
  public registerSession(
    ws: WebSocket,
    token: ReturnType<typeof randomUUID>,
    username: string
  ) {
    if (
      this.tokens.find((val) => val.token == token && val.username == username)
    ) {
      const session = new PlayerSession(username, ws, token);
      this.tokens = this.tokens.filter((val) => val.token != token);
      this.sessions.push(session);
      return session;
    } else {
      return false;
    }
  }

  /**
   * removeSessionBySocket
   */
  public removeBySocket(ws: WebSocket) {
    this.sessions = this.sessions.filter((val) => val.socket !== ws);
  }

  /**
   * removeSessionsByUsername
   */
  public removeSessionsByUsername(username: string) {
    this.sessions = this.sessions.filter((val) => val.username !== username);
  }

  /**
   * reset
   */
  public reset() {
    this.sessions = [];
    this.tokens = [];
  }
}
