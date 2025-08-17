import { lazy } from "react";
import LoginHome from "./auth/Home";
import Dashboard from "./dashboard/Home";
import Calendar from "./dashboard/Calendar";
import Debtor from "./dashboard/Debtor";
import Hisobot from "./dashboard/Hisobot";
import Settings from "./dashboard/Settings";
import DebtorCreate from "./dashboard/DebtorCreate";
import SingleDebtor from "./dashboard/SingleDebtor";
import DebtCreate from "./dashboard/DebtCreate";
import DebtSingle from "./dashboard/DebtSingle";
import DebtPayment from "./dashboard/DebtPayment";

const Login = lazy(
  () =>
    new Promise((resolve: any) => {
      return setTimeout(() => resolve(import("./auth/Login")), 1800);
    })
);

const Notification = lazy(
  () =>
    new Promise((resolve: any) => {
      return setTimeout(
        () => resolve(import("./dashboard/report/Notification")),
        1000
      );
    })
);
const Message = lazy(
  () =>
    new Promise((resolve: any) => {
      return setTimeout(
        () => resolve(import("./dashboard/report/Message")),
        1000
      );
    })
);

export {
  Dashboard,
  DebtorCreate,
  SingleDebtor,
  Settings,
  Hisobot,
  Debtor,
  Calendar,
  Login,
  LoginHome,
  DebtCreate,
  DebtSingle,
  DebtPayment,
  Notification,
  Message,
};
