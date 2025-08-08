import { instance } from "../hooks/instance";

export const Login = (
  data: { name: string; password: string },
  setCookies: any
) => {
  instance()
    .post("/auth/login", data)
    .then((res) => {
      setCookies("token", res.data.token);
      location.pathname = "/";
    });
};
