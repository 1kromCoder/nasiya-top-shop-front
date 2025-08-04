import Home from "./dashboard/Home";
import LoginHome from "./auth/Home";
import { lazy } from "react";

const Login = lazy(
  () =>
    new Promise((resolve: any) => {
      return setTimeout(() => resolve(import("./auth/Login")), 1800);
    })
);

export { Home, Login, LoginHome };
