import { BACKEND_URL, ID } from "./../ws/constants";
import axios from "axios";

type RegisterResponse = {
  error?: string;
  username: string;
  id: ID;
};

const registerUser = async (username: string) => {
  return await axios
    .post<RegisterResponse>(BACKEND_URL + "/auth", { username })
    .then((r) => r.data)
    .catch((e) => {
      const data = { error: "Some error occured!" };
      if (e instanceof axios.AxiosError && e.response?.status == 400) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        data.error = e.response?.data.error;
      }
      return data as RegisterResponse;
    });
};

export default registerUser;
