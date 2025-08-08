import { HomeIcon, SettingsIcon, UsersIcon, WalletIcon } from "../assets/icons";
import { MenuItem } from "../components";
import { PATH } from "../hooks/Path";

const Menu = () => {
  return (
    <div className="border-t-[1px] fixed bg-white z-50 w-full bottom-0 border-[#EDEDED] ">
      <div className="containers">
        <div className="flex justify-between">
          <MenuItem
            to={PATH.main}
            title="Asosiy"
            icon={<HomeIcon classList="!mx-auto !mb-[2px]" />}
          />
          <MenuItem
            to={PATH.mijoz}
            title="Mijozlar"
            icon={<UsersIcon classList="!mx-auto !mb-[2px]" />}
          />
          <MenuItem
            to={PATH.hisobot}
            title="Hisobot"
            icon={<WalletIcon classList="!mx-auto !mb-[2px]" />}
          />
          <MenuItem
            to={PATH.sozlama}
            title="Sozlama"
            icon={<SettingsIcon classList="!mx-auto !mb-[2px]" />}
          />
        </div>
      </div>
    </div>
  );
};

export default Menu;
