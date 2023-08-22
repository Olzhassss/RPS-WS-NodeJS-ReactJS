import { randomUUID } from "crypto";
import { ID } from "../ws/types";

/**
 * This class meant to be used for JWT authentication and sessions control, but idea has not been implemented.
 */
export class Token {
  username: string;
  token: ID;

  constructor(username: string) {
    this.token = randomUUID();
    this.username = username;
  }
}
