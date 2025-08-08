import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import "dayjs/locale/zh-cn";
import Heading from "./Heading";
import { FindMonth } from "../hooks/FindMonth";
import { Button, Calendar } from "antd";
import { ArrowIcon } from "../assets/icons";
import Text from "./Text";
import { formatNumber } from "../hooks/FormatNumber";
import React, { useEffect, type Dispatch, type SetStateAction } from "react";
dayjs.extend(localeData);

const wrapperStyle: React.CSSProperties = {
  width: "100%",
};

const CustomCalendar: React.FC<{
  totalForMonth: number;
  setNowDate: Dispatch<SetStateAction<dayjs.Dayjs | undefined>>;
  nowDate: dayjs.Dayjs | undefined;
}> = ({ nowDate, setNowDate, totalForMonth }) => {
  function handleChooseDay(value: any) {
    setNowDate(value);
  }

  function handleChangeMonth(
    value: dayjs.Dayjs,
    onChange: (data: dayjs.Dayjs) => void
  ) {
    const newMonth = value.add(1, "month");
    onChange(newMonth);
  }

  return (
    <div style={wrapperStyle}>
      <Calendar
        onChange={handleChooseDay}
        fullscreen={false}
        value={nowDate}
        headerRender={({ value, onChange }) => {
          useEffect(() => {
            setNowDate(value);
          }, []);
          return (
            <>
              <div className="flex items-center justify-between mt-[36px]">
                <Heading tag="h2" classList="!font-bold !text-[18px]">
                  {FindMonth(value.month())}, {value.year()}
                </Heading>

                <div className="space-x-[16px]">
                  <Button
                    onClick={() => setNowDate(nowDate?.subtract(1, "month"))}
                    className="!w-[40px] !p-0 hover:!border-[#735CD8] !rounded-[12px] !h-[40px]"
                  >
                    <ArrowIcon />
                  </Button>
                  <Button
                    onClick={() => handleChangeMonth(value, onChange)}
                    className="!w-[40px] !p-0 hover:!border-[#735CD8] !rounded-[12px] !h-[40px]"
                  >
                    <ArrowIcon classList="rotate-[180deg]" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between my-[20px]">
                <Text classList="!font-semibold">Oylik jami:</Text>
                <strong className="text-[14px] font-extrabold">
                  {formatNumber(totalForMonth)}{" "}
                  <span className="font-normal">so'm</span>
                </strong>
              </div>
            </>
          );
        }}
      />
    </div>
  );
};

export default CustomCalendar;
