import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import userdata from "../stores/userdata";
import registerUser from "../utils/register_user";
import { WS_METHODS } from "../ws/constants";
import { sendMessage } from "../ws/utils";

function SignIn() {
  const [username, setUsername] = React.useState("");
  const [error, setError] = React.useState("");
  const navigate = useNavigate();

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const un: string = String(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (event.currentTarget.elements as unknown as any).username.value
    );

    if (!un) {
      setError("Username cannot be empty!");
      return;
    }
    const data = await registerUser(un);
    if (data.error) {
      setError(data.error);
    } else {
      sendMessage({
        method: WS_METHODS.REGISTER,
        id: data.id,
        username: data.username,
      });
      userdata.socket?.addEventListener(
        WS_METHODS.REGISTER,
        () => navigate("/queue"),
        { once: true }
      );
    }
  };

  return (
    <div
      className="modal show d-flex align-items-center"
      style={{
        backgroundColor: "rgba(0,0,0,0.4)",
      }}
    >
      <Modal.Dialog style={{ flex: "auto" }}>
        <Modal.Header>
          <Modal.Title>Sign In or Sign Up</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form method="post" onSubmit={(e) => void submitHandler(e)}>
            <Form.Group className="mb-5" style={{ textAlign: "left" }}>
              <Form.Label>Enter Your username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Unique Username"
                name="username"
                pattern="[A-Za-z]{3,20}"
                onChange={(e) =>
                  !e.target.validity.patternMismatch &&
                  setUsername(e.target.value)
                }
              />
              <Form.Text className="text-muted">
                Use latin letters and enter a username of length between 3 and
                20 characters.
                {error ? <p className="text-danger">{error}</p> : ""}
              </Form.Text>
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              disabled={username ? false : true}
            >
              Enter {username ? `as ${username}` : ""}
            </Button>
          </Form>
        </Modal.Body>
      </Modal.Dialog>
    </div>
  );
}

export default SignIn;
