import { useNavigate } from "react-router-dom";
import { Heading, Text } from "../../components";
import { ArrowIcon, BackIcon } from "../../assets/icons";

const DebtPayment = () => {
  const navigate = useNavigate();
  return (
    <div className="containers !mt-[30px]">
      <div className="flex items-center justify-between mb-[27px] w-[50%] gap-[12px]">
        <button className="cursor-pointer" onClick={() => navigate(-1)}>
          {" "}
          <BackIcon />{" "}
        </button>
        <Heading tag="h2">Nasiyani so‘ndirish</Heading>
      </div>
      <Heading classList="!text-[18px] !mb-[20px]" tag="h2">
        To‘lov
      </Heading>
      <ul>
        <li className="flex items-center justify-between py-[16px] border-b-[1px] border-[#EEEEEE]">
          <Text classList="!text-[14px] font-normal">1 oyga so‘ndirish</Text>
          <button className="rotate-[180deg]">
            <ArrowIcon classList="payment-debt" />
          </button>
        </li>
        <li className="flex items-center justify-between py-[16px] border-b-[1px] border-[#EEEEEE]">
          <Text classList="!text-[14px] font-normal">
            Har qanday miqdorda so‘ndirish
          </Text>
          <button className="rotate-[180deg]">
            <ArrowIcon classList="payment-debt" />
          </button>
        </li>
        <li className="flex items-center justify-between py-[16px] border-b-[1px] border-[#EEEEEE]">
          <Text classList="!text-[14px] font-normal">
            To‘lov muddatini tanlash
          </Text>
          <button className="rotate-[180deg]">
            <ArrowIcon classList="payment-debt" />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default DebtPayment;
