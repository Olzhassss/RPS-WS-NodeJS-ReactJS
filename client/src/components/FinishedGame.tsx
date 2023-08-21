import React from "react";
import Badge from "react-bootstrap/Badge";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";
import match from "../stores/match";
import userdata from "../stores/userdata";
import { WS_METHODS } from "../ws/constants";
import { sendMessage } from "../ws/utils";
import History from "./History";
import { observer } from "mobx-react-lite";

const FinishedGame = observer(() => {
  const navigate = useNavigate();

  function handleNew() {
    sendMessage({
      method: WS_METHODS.RETRY_REJECT,
      id: userdata.session_id as string,
      username: userdata.username as string,
      match_id: match.match_id as string,
    });
    navigate("/" + userdata.session_id);
  }

  React.useEffect(() => {
    const redirect = () =>
      navigate("/" + userdata.session_id + "/" + match.match_id);
    userdata.socket?.addEventListener(WS_METHODS.PREPARE, redirect, {
      once: true,
    });
    return () => {
      userdata.socket?.removeEventListener(WS_METHODS.PREPARE, redirect);
    };
  }, [navigate]);

  const { result } = match;
  return (
    <Container style={{ maxWidth: "900px" }}>
      <Row className="pt-5">
        <h1>{result}</h1>
      </Row>
      <Row>
        <hr className="my-5" />
      </Row>
      <Row className="justify-content-center mb-5">
        <Row>
          <Col>
            <Button
              variant="outline-success"
              className="d-block ms-auto me-2 h-100"
              style={{ minWidth: "50%" }}
              size="lg"
              onClick={handleRetry}
            >
              {match.accepts_retries ? (
                "Retry!"
              ) : (
                <Badge bg="warning" text="dark">
                  Retries were rejected.
                </Badge>
              )}
            </Button>
          </Col>
          <Col>
            <Button
              variant="outline-danger"
              className="d-block w-50 me-auto ms-2 h-100"
              size="lg"
              onClick={handleNew}
            >
              New Game
            </Button>
          </Col>
        </Row>
      </Row>
      <Row style={{ marginTop: "100px" }}>
        <History />
      </Row>
    </Container>
  );
});

const handleRetry: React.MouseEventHandler<HTMLButtonElement> = (e) => {
  e.currentTarget.innerText = "Awating replies...";
  e.currentTarget.disabled = true;
  sendMessage({
    method: WS_METHODS.RETRY,
    id: userdata.session_id as string,
    username: userdata.username as string,
    match_id: match.match_id as string,
  });
};

export default FinishedGame;
