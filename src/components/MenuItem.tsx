import { NavLink } from "react-router-dom";
import Text from "./Text";
import type { ReactNode } from "react";

const MenuItem = ({
  title,
  to,
  icon,
}: {
  title: string;
  to: string;
  icon: ReactNode;
}) => {
  return (
    <NavLink
      to={to}
      className="w-[25%] text-[#637D92] cursor-pointer py-[9.5px] text-center"
    >
      {icon}
      <Text classList="!text-[10px] !font-normal">{title}</Text>
    </NavLink>
  );
};

export default MenuItem;
