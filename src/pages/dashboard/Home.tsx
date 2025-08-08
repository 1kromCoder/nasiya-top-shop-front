import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { instance } from "../../hooks/instance";
import { Heading, Text } from "../../components";
import { CalendarIcon, CashIcon, EyeIcon, PlusIcon } from "../../assets/icons";
import { API } from "../../hooks/getEnv";
import { Button } from "antd";
import { Avatar } from "../../assets/images";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../hooks/Path";
import type { SellerType } from "../../@types/SellerType";
import { formatNumber } from "../../hooks/FormatNumber";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showLimit, setShowLimit] = useState<boolean>(false);
  const [cookies, _setCookie, removeCookies] = useCookies(["token"]);
  const { data: sellerData2, isLoading } = useQuery<SellerType>({
    queryKey: ["get-seller"],
    queryFn: () =>
      instance()
        .get("/auth/me", {
          headers: { Authorization: `Bearer ${cookies.token}` },
        })
        .then((res) => res.data)
        .catch((err) => {
          if (err.response.status == 401) {
            removeCookies("token");
            location.pathname = "/";
          }
        }),
  });

  const totalDebt =
    sellerData2?.Debtor?.reduce((acc, debtor) => {
      const debtorTotal =
        debtor.Debts?.reduce((sum, debt) => sum + (debt.amount || 0), 0) || 0;
      return acc + debtorTotal;
    }, 0) ?? 0;

  return (
    <div className="containers !pt-[30px]">
      <div className="flex items-center justify-between mb-[38px]">
        <div className="flex gap-[15px] items-center">
          <img
            className="rounded-full"
            src={`${
              sellerData2?.img ? `${API}/file/${sellerData2.img}` : Avatar
            }`}
            alt="Avatar"
            width={40}
            height={40}
          />
          <strong className="font-semibold text-[16px]">
            {isLoading ? "---------" : sellerData2?.name}
          </strong>
        </div>
        <Button
          onClick={() => navigate(PATH.calendar)}
          className="bg-[#5F5F5F] hover:border-[#735DC8] cursor-pointer calendar-button duration-300 !w-[40px] flex items-center justify-center !p-0 !rounded-[12px] !h-[40px]"
        >
          <CalendarIcon />
        </Button>
      </div>

      <div className="rounded-[20px] relative bg-[#30AF49] mb-[31px] p-[18px] text-center">
        <strong className="font-bold text-white mb-[4px]">
          {showLimit
            ? "*******"
            : isLoading
            ? "---------"
            : formatNumber(totalDebt)}{" "}
          so'm
        </strong>
        <Text classList="!text-[14px] !text-white">Umumiy nasiya:</Text>
        <button
          onClick={() => setShowLimit(!showLimit)}
          className="absolute cursor-pointer duration-300 hover:scale-[1.2] top-0 bottom-0 my-auto right-[22px]"
        >
          <EyeIcon />
        </button>
      </div>

      <div className="flex justify-between mb-[40px]">
        <div className="p-[16px] !w-[48%] border-[1px] border-[#ECECEC] rounded-[16px]">
          <Text classList="text-[14px] !mb-[32px]">
            Kechiktirilgan to‘lovlar
          </Text>
          <Text classList="text-[#F94D4D] text-[18px]">
            {isLoading ? "------" : sellerData2?.overdueDebts.length}
          </Text>
        </div>
        <div className="p-[16px] !w-[48%] border-[1px] border-[#ECECEC] rounded-[16px]">
          <Text classList="text-[14px] !mb-[32px]">Mijozlar soni</Text>
          <Text classList="text-[#30AFA9] text-[18px] mt-[54px]">
            {isLoading ? "------" : sellerData2?.Debtor?.length}
          </Text>
        </div>
      </div>

      <Heading tag="h2" classList="text-[18px] !mb-[26px]">
        Hamyoningiz
      </Heading>
      <div className="flex items-center justify-between mb-[28px]">
        <div className="flex items-center gap-[12px]">
          <button className="w-[48px] h-[48px] rounded-full flex items-center justify-center">
            <CashIcon />
          </button>
          <div className="flex flex-col">
            <span className="font-medium text-[13px]">Hisobingizda</span>
            <strong className="font-bold text-[18px]">
              {isLoading
                ? "------"
                : formatNumber(
                    sellerData2?.balance ? sellerData2.balance : 0
                  )}{" "}
              so'm
            </strong>
          </div>
        </div>
        <button className="w-[36px] h-[36px] cursor-pointer bg-[#3478F7] rounded-full flex items-center justify-center">
          <PlusIcon />
        </button>
      </div>

      <div className="flex justify-between items-center">
        <Text classList="text-[14px] !font-medium">Bu oy uchun to‘lov:</Text>
        <Text classList="text-[14px] !font-semibold text-[#30AFA9]">
          To‘lov qilingan
        </Text>
      </div>
    </div>
  );
};

export default Dashboard;
