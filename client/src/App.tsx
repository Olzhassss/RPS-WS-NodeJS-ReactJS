import "./styles/App.css";
import Header from "./components/Header";
import { Outlet, useNavigate } from "react-router-dom";
import React from "react";
import { startWSConnetion } from "./ws/utils";

function App() {
  const navigate = useNavigate();

  React.useEffect(() => {
    startWSConnetion(true);

    // I decided to not use the following, for now.

    // const redirect = () => navigate("/");
    // ws.addEventListener(WS_METHODS.UNAUTHORIZED, redirect);
    // return () => {
    //   ws.removeEventListener(WS_METHODS.UNAUTHORIZED, redirect);
    //   if (ws.readyState === 1) {
    //     ws.close();
    //   } else {
    //     ws.addEventListener("open", () => {
    //       ws.close();
    //     });
    //   }
    //   userdata.setSocket(null);
    // };
  }, [navigate]);
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default App;
