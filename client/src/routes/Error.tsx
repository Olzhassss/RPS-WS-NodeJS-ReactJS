import Card from "react-bootstrap/Card";
import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

function Error() {
  const error = useRouteError();
  console.log(error);
  return (
    <>
      <Card>
        <Card.Header>
          <h1>
            {isRouteErrorResponse(error)
              ? `Error ${error.status}: ${error.data}`
              : "Unknown error message"}
          </h1>
          <Link to="/">Go to Home page</Link>
        </Card.Header>
      </Card>
    </>
  );
}

export default Error;
