import { game } from "./../db";
import { RequestHandler } from "express";

// Check request credentials and return session id with accepted username if successful
const authenticate: RequestHandler = (req, res) => {
  const { username } = req.body;

  // Input validation
  if (!username) {
    return res.status(400).json({ error: "Undefined username." });
  }
  if (!RegExp("^[a-zA-Z]{3,20}$").test(username)) {
    return res
      .status(400)
      .json({ error: "Username does not match required format." });
  }

  const result = game.sessions.createToken(username);
  if (!result) {
    // Session already exists
    return res
      .status(400)
      .json({ error: "User with this username is already online." });
  } else {
    console.log("Session created for user with username = " + result.username);
    return res
      .status(200)
      .json({ username: result.username, id: result.token });
  }
};

export default authenticate;
