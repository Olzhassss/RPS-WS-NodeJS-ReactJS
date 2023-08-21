import Spinner from "react-bootstrap/Spinner";

function AwaitingGame() {
  return (
    <div className="flex items-center align-center">
      <h1>Awaiting Results...</h1>
      <br />
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}

export default AwaitingGame;
