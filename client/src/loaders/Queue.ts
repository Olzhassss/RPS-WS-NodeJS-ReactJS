import { type LoaderFunction } from "react-router-dom";
import userdata from "../stores/userdata";
import { sendMessage } from "../ws/utils";
import { WS_METHODS } from "../ws/constants";

const loader: LoaderFunction = () => {
  // const username = params.username as string;
  // await history.fetchData(username);
  return null;
};

export default loader;
