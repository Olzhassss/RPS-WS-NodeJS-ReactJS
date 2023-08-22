import { observer } from "mobx-react-lite";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/esm/Button";
import { Link } from "react-router-dom";
import userdata from "../stores/userdata";
import { sendDestroy } from "../ws/utils";

const Header = observer(() => {
  return (
    <div style={{ marginBottom: "5rem" }}>
      <Container>
        <Row className="justify-content-md-center align-items-center">
          <Col xs lg="2">
            Username: {userdata.username}
          </Col>
          <Col md="auto">
            <Link to="/" onClick={logOut}>
              <Button variant="outline-secondary">Change User</Button>
            </Link>
          </Col>
          <Col xs lg="2">
            Session: {userdata.session_id}
          </Col>
          <Col xs lg="2">
            Score / Total matches: {userdata.score}/{userdata.totalMatches}
          </Col>
        </Row>
      </Container>
    </div>
  );
});

function logOut() {
  if (userdata.session_id) {
    sendDestroy(userdata.session_id);
    userdata.reset();
  }
}

export default Header;
