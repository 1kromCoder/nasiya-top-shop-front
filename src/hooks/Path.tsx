import { HomeIcon, SettingsIcon, UsersIcon, WalletIcon } from "../assets/icons";
import { Calendar, Dashboard, Login } from "../pages";
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
