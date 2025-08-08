import { Input } from "antd";
import { SearchIcon, SliderIcon } from "../../assets/icons";
import { Heading } from "../../components";

const Debtor = () => {

    
  return (
    <>
      <div className="containers !mt-[30px]">
        <div className="flex justify-between">
          <Input
            className="!bg-[#F6F6F6] border-[1px] flex text-[16px] font-medium gap-[10px] !w-[303px] !h-[48px] !rounded-[12px] py-[12px] px-[16px]"
            type="text"
            prefix={<SearchIcon />}
            placeholder="Mijozlarni qidirish..."
          ></Input>
          <SliderIcon />
        </div>

        <div className="">
          <div className="flex-col !gap-[4px] !bg-[#F6F6F6] flex !w-[353px] h-[143px] !rounded-[12px] !p-4 !mt-[28px]">
          <Heading classList="!text-[16px]" tag="h2">
            Kalendar
          </Heading>
          <p className="!text-[14px] !font-medium !text-[#0e0d0d81]">+998 91 123 45 67</p>
          <p className="!text-[12px] !font-semibold !text-[#0e0d0d81] !mt-4">Jami nasiya:</p>
          <span className="!text-[14px] !font-medium !text-[#F94D4D]">-800 000 so‘m</span>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default Debtor;
