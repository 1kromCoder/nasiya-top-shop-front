import { lazy } from "react";
import LoginHome from "./auth/Home";
import Dashboard from "./dashboard/Home";
import Calendar from "./dashboard/Calendar";
import Debtor from "./dashboard/Debtor";
import Settings from "./dashboard/Settings";
import DebtorCreate from "./dashboard/DebtorCreate";
import SingleDebtor from "./dashboard/SingleDebtor";
import DebtCreate from "./dashboard/DebtCreate";
import DebtSingle from "./dashboard/DebtSingle";
import DebtPayment from "./dashboard/DebtPayment";
import MyProfile from "./dashboard/MyProfile";
import Example from "./dashboard/Example";
import ExampleCreate from "./dashboard/ExampleCreate";

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
        () => resolve(import("./dashboard/Notification")),
        1000
      );
    })
);
const Message = lazy(
  () =>
    new Promise((resolve: any) => {
      return setTimeout(() => resolve(import("./dashboard/Message")), 1000);
    })
);

export {
  Dashboard,
  DebtorCreate,
  SingleDebtor,
  Settings,
  ExampleCreate,
  MyProfile,
  Debtor,
  Calendar,
  Example,
  Login,
  LoginHome,
  DebtCreate,
  DebtSingle,
  DebtPayment,
  Notification,
  Message,
};
