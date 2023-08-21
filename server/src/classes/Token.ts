import { randomUUID } from "crypto";
import { ID } from "../ws/types";
export class Token {
  username: string;
  token: ID;

  constructor(username: string) {
    this.token = randomUUID();
    this.username = username;
  }
}
