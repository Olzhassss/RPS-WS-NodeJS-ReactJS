import { observer } from "mobx-react-lite";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import match, { Choice } from "../stores/match";

const ActiveGame = observer(() => {
  const mapping = [
    {
      choice: Choice.ROCK,
      label: "Rock",
    },
    {
      choice: Choice.PAPER,
      label: "Paper",
    },
    {
      choice: Choice.SCISSORS,
      label: "Scissors",
    },
  ];

  // const handleChange: React.FormEventHandler<HTMLFormElement> = (e) => {
  //   e.preventDefault();
  //   const ch = (e.currentTarget.elements.namedItem("choice") as RadioNodeList)
  //     .value as Choice;
  //   if (!(ch in Choice)) {
  //     console.error("Incorrect value!");
  //   } else {
  //     console.info("Set Choice to " + ch);
  //     match.setChoice(ch);
  //   }
  // };

  return (
    <Container style={{ maxWidth: "900px" }}>
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <h2>Countdown: {match.countdown} secs...</h2>
              <br />
              <h3>Players of this match:</h3>
              <ul style={{ listStyleType: "none" }}>
                {match.players.map((val) => (
                  <li key={val}>{val}</li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form>
            {mapping.map((val) => (
              <Form.Check
                className="form-control-lg"
                key={val.choice}
                inline
                label={val.label}
                name="choice"
                type="radio"
                value={val.choice}
                onChange={(e) => {
                  match.setChoice(e.currentTarget.value as Choice);
                  console.log(match.choice);
                }}
              />
            ))}
          </Form>
        </Col>
      </Row>
    </Container>
  );
});

export default ActiveGame;
