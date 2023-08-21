import axios from "axios";
import { makeAutoObservable } from "mobx";
import { BACKEND_URL, ID } from "../ws/constants";
import { MatchResult } from "./match";

export type HistoryTableRow = {
  match_id: ID;
  players: string[];
  result: MatchResult;
  date: string;
};

class History {
  table: HistoryTableRow[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  append(row: HistoryTableRow) {
    this.table.push(row);
  }

  saveMatch(match_id: ID, players: string[], result: MatchResult) {
    const row = {
      match_id,
      players,
      result,
      date: "Not implemented yet.",
    };
    this.append(row);
  }

  async fetchData(username: string) {
    throw Error("Not implemented yet.");
    await axios
      .get<HistoryTableRow[]>(BACKEND_URL + `/${username}/history`)
      .then((res) => (this.table = [...res.data]));
    return;
  }
}

export default new History();
