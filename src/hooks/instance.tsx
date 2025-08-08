import axios from "axios";
import { API } from "./getEnv";

export const instance = () => {
  return axios.create({ baseURL: API });
};
