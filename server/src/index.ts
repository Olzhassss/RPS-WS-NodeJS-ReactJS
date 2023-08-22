import { WebSocketServer } from "ws";
import express from "express";
import http from "http";
import cors from "cors";
import { game } from "./db";
import authenticate from "./utils/authenticate";
import { messageHandler } from "./ws/config";
import { configDotenv } from "dotenv";
configDotenv();

const PORT = process.env.PORT || 5000;

export const MATCH_PLAYERS_NUMBER =
  Number(process.env.MATCH_PLAYERS_NUMBER) || 2;

export const MATCH_SUBMIT_DELAY =
  Number(process.env.MATCH_SUBMIT_DELAY) || 1000;

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
server.listen(PORT, () => console.log(`server started on PORT ${PORT}`));
const wsserver = new WebSocketServer({ server });

// Create an endpoint for authentication.
app.post("/auth", (req, res) => {
  return authenticate(req, res, undefined);
});

app.post("/reset", (req, res) => {
  game.reset();
  return res.status(200).send("<p>Succesful reset</p>");
});

wsserver.on("connection", (socket) => {
  console.log("New client connected!");

  socket.on("close", () => {
    game.removeBySocket(socket);

    console.log("Client has disconnected!");
    console.log("Remaining active sessions:");
    console.log(game.sessions.getSessions());
  });

  socket.on("message", (message) => messageHandler(socket, message));
});
