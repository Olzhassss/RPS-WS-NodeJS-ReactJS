import React from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";
import History from "../components/History";
import userdata from "../stores/userdata";
import { WS_METHODS } from "../ws/constants";
import { sendMessage } from "../ws/utils";

function Queue() {
  const [started, setStart] = React.useState(false);
  const navigate = useNavigate();
  const redirect = () => {
    navigate("/game");
  };

  React.useEffect(() => {
    if (userdata.isEmpty()) {
      navigate("/");
    } else {
      console.log("Sending VERIFY on component initialization.");
      sendMessage({
        method: WS_METHODS.VERIFY,
        id: userdata.session_id as string,
        username: userdata.username as string,
      });
    }
  }, [navigate]);

  const handleStart = () => {
    sendMessage({
      method: WS_METHODS.ENQUEUE,
      id: userdata.session_id ?? undefined,
    });
    userdata.socket?.addEventListener(WS_METHODS.PREPARE, redirect, {
      once: true,
    });
    setStart(true);
  };

  const handleStop = () => {
    sendMessage({
      method: WS_METHODS.DEQUEUE,
      id: userdata.session_id ?? undefined,
    });
    userdata.socket?.removeEventListener(WS_METHODS.PREPARE, redirect);
    setStart(false);
  };

  return (
    <Container style={{ maxWidth: "900px" }}>
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <h2>{started ? "In Queue." : "Prepared to start."}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            disabled={started}
            onClick={handleStart}
            className="d-block w-50 ms-auto me-2"
          >
            Start
          </Button>
        </Col>
        <Col>
          <Button
            disabled={!started}
            onClick={handleStop}
            className="d-block w-50 me-auto ms-2"
          >
            Stop
          </Button>
        </Col>
      </Row>
      <Row style={{ marginTop: "100px" }}>
        <History />
      </Row>
    </Container>
  );
}

export default Queue;
