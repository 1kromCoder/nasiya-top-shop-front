import type { ReactNode } from "react";
import { Menu } from "../modules";
import { Toaster } from "react-hot-toast";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-[100vh] relative">
      <div className="pb-[55px]">
        <Toaster position="top-center" />
        {children}</div>
      <Menu />
    </div>
  );
};

export default DashboardLayout;
