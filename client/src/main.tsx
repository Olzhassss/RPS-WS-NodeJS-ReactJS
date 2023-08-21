import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
// import "./styles/index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Entry from "./routes/Entry.tsx";
import Queue from "./routes/Queue.tsx";
import Game from "./routes/Game.tsx";
import Error from "./routes/Error.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Entry />,
      },
      {
        path: "queue",
        element: <Queue />,
      },
      {
        path: "game",
        element: <Game />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
