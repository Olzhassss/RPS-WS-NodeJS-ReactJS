import "./styles/App.css";
import Header from "./components/Header";
import { Outlet, useNavigate } from "react-router-dom";
import React from "react";
import userdata from "./stores/userdata";
import { startWSConnetion } from "./ws/utils";
import { WS_METHODS } from "./ws/constants";

function App() {
  const navigate = useNavigate();

  React.useEffect(() => {
    const ws = startWSConnetion(true);
    const redirect = () => navigate("/");
    ws.addEventListener(WS_METHODS.UNAUTHORIZED, redirect);

    return () => {
      ws.removeEventListener(WS_METHODS.UNAUTHORIZED, redirect);
      if (ws.readyState === 1) {
        ws.close();
      } else {
        ws.addEventListener("open", () => {
          ws.close();
        });
      }
      userdata.setSocket(null);
    };
  }, [navigate]);
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default App;
