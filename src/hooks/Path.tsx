import { HomeIcon, SettingsIcon, UsersIcon, WalletIcon } from "../assets/icons";
import {
  Calendar,
  Dashboard,
  DebtCreate,
  DebtorCreate,
  DebtPayment,
  DebtSingle,
  Login,
  SingleDebtor,
} from "../pages";
import Home from "../pages/auth/Home";

export const PATH = {
  main: "/",
  login: "/login",
  calendar: "/debts/date",
  seller: "/seller",
  asosiy: "/asosiy",
  mijoz: "/debtors",
  hisobot: "/hisobot",
  sozlama: "/sozlama",
  debtorCreate: "/debtors/create",
  singleDebtor: "/debtors/:id",
  debtorEdit: "/debtor/:id/edit",
  debtCreate: "/debtors/:id/create-debt",
  debtUpdate: "/debtors/:id/debts/:debtId/update",
  debtSingle: "/debtors/:id/debts/:debtId",
  debtPayment: "/debtors/:id/debts/:debtId/payment",
};

export const DashboardList = [
  {
    id: 1,
    path: PATH.main,
    element: <Home />,
  },

  {
    id: 2,
    path: PATH.login,
    element: <Login />,
  },
  {
    id: 3,
    path: PATH.seller,
    element: <Dashboard />,
  },
  {
    id: 4,
    path: PATH.calendar,
    element: <Calendar />,
  },
  {
    id: 5,
    path: PATH.debtorCreate,
    element: <DebtorCreate />,
  },
  {
    id: 6,
    path: PATH.singleDebtor,
    element: <SingleDebtor />,
  },
  {
    id: 7,
    path: PATH.debtCreate,
    element: <DebtCreate />,
  },
  {
    id: 8,
    path: PATH.debtorEdit,
    element: <DebtorCreate />,
  },
  {
    id: 9,
    path: PATH.debtUpdate,
    element: <DebtCreate />,
  },
  {
    id: 10,
    path: PATH.debtSingle,
    element: <DebtSingle />,
  },
  {
    id: 11,
    path: PATH.debtPayment,
    element: <DebtPayment />,
  },
];

export const DashboardMenu = [
  {
    key: 1,
    label: "Asosiy",
    path: PATH.asosiy,
    icon: <HomeIcon />,
  },
  {
    key: 2,
    label: "Mijozlar",
    path: PATH.mijoz,
    icon: <UsersIcon />,
  },
  {
    key: 3,
    label: "Hisobot",
    path: PATH.hisobot,
    icon: <WalletIcon />,
  },
  {
    key: 4,
    label: "Sozlama",
    path: PATH.sozlama,
    icon: <SettingsIcon />,
  },
];
