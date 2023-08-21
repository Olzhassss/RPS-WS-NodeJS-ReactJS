import { type LoaderFunction } from "react-router-dom";
import match from "../stores/match";
import userdata from "../stores/userdata";
import { WS_METHODS } from "../ws/constants";
import { sendMessage } from "../ws/utils";

export const loader: LoaderFunction = () => {
  return null;
};

export default loader;
