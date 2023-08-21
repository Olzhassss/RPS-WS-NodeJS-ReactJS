import { observer } from "mobx-react-lite";
import Accordion from "react-bootstrap/Accordion";
import Table from "react-bootstrap/Table";
import history from "../stores/history";

const History = observer(() => {
  return (
    <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>History of Matches</Accordion.Header>
        <Accordion.Body>
          <Table striped bordered hover variant="light">
            <thead>
              <tr>
                <th>Match ID</th>
                <th>Players</th>
                <th>Result</th>
                {/* <th>Date (N/A)</th> */}
              </tr>
            </thead>
            <tbody>
              {history.table.map((element) => (
                <tr key={element.match_id}>
                  <td>{element.match_id}</td>
                  <td>
                    <ul style={{ textAlign: "left" }}>
                      {element.players.map((val) => (
                        <li key={element.match_id + val}>{val}</li>
                      ))}
                    </ul>
                  </td>
                  <td>{element.result}</td>
                  {/* <td>{element.date}</td> */}
                </tr>
              ))}
            </tbody>
          </Table>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
});
export default History;
