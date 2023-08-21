import { observer } from "mobx-react-lite";
import match, { MatchState } from "../stores/match";
import ActiveGame from "../components/ActiveGame";
import AwaitingGame from "../components/AwaitingGame";
import FinishedGame from "../components/FinishedGame";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { sendMessage } from "../ws/utils";
import { WS_METHODS } from "../ws/constants";
import userdata from "../stores/userdata";

const Game = observer(() => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (userdata.isEmpty() || match.isEmpty()) {
      navigate("/");
    } else {
      sendMessage({
        method: WS_METHODS.VERIFY,
        id: userdata.session_id as string,
        username: userdata.username as string,
        match_id: match.match_id as string,
      });
    }
  }, [navigate]);

  return renderComponent(match.state);
});
export default Game;

const renderComponent = (state: MatchState) => {
  switch (state) {
    case MatchState.STARTED:
      return <ActiveGame />;
    case MatchState.AWAITING:
      return <AwaitingGame />;
    case MatchState.FINISHED:
      return <FinishedGame />;
    case MatchState.IDLE:
      return (
        <h2>
          What are you doing here? <Link to="/">Go back home</Link>
        </h2>
      );
    default:
      return <p>Unknown state: {state}</p>;
  }
};
