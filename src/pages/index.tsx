import { lazy } from "react";
import LoginHome from "./auth/Home";
import Dashboard from "./dashboard/Home";
import Calendar from "./dashboard/Calendar";
import Debtor from "./dashboard/Debtor";
import Hisobot from "./dashboard/Hisobot";
import Settings from "./dashboard/Settings";
const Login = lazy(
  () =>
    new Promise((resolve: any) => {
      return setTimeout(() => resolve(import("./auth/Login")), 1800);
    })
);

export { Dashboard, Settings, Hisobot, Debtor, Calendar, Login, LoginHome };
