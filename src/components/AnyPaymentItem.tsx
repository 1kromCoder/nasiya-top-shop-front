import { Checkbox } from "antd";
import Text from "./Text";
import {
  useEffect,
  useState,
  type Dispatch,
  type FC,
  type SetStateAction,
} from "react";
import type { PaymentType } from "../@types/Payments";
import { formatNumber } from "../hooks/FormatNumber";

const AnyPaymentItem: FC<{
  setTotalPay: Dispatch<SetStateAction<number[]>>;
  payAll: boolean;
  payMonth: { month: number; total: number }[];
  item: { month: number; total: number };
  index: number;
  endDate?: string;
  setPayMonthPayed: Dispatch<SetStateAction<{ month: number; total: number }[]>>;
}> = ({ payAll, setPayMonthPayed, item, endDate, setTotalPay, index }) => {
  const [check, setCheck] = useState<boolean>(false);

  function handleCheck() {
    setCheck((prev) => !prev);
    setPayMonthPayed((prev) => {
      const found = prev.find((data) => data.month === item.month);
      if (!found) {
        return [...prev, item];
      } else {
        return prev.filter((data) => data.month !== item.month);
      }
    });
    setTotalPay((prev) => {
      if (!check) {
        return [...prev, item.total];
      } else {
        const deleteIndex = prev.findIndex((data) => data === item.total);
        if (deleteIndex > -1) {
          const copy = [...prev];
          copy.splice(deleteIndex, 1);
          return copy;
        }
        return prev;
      }
    });
  }

  useEffect(() => {
    setCheck(payAll);
  }, [payAll]);

  return (
    <li
      onClick={handleCheck}
      className="py-[16px] cursor-pointer border-b-[1px] flex items-center justify-between border-[#ECECEC]"
    >
      <div>
        <Text classList="!font-medium !text-[12px]">{index + 1}-oy</Text>
        {endDate && (
          <Text classList="!font-semibold !text-[14px]">
            {endDate.split("T")[0]}
          </Text>
        )}
      </div>
      <div className="flex items-center gap-[12px]">
        <Text classList="!font-bold !text-[14px]">
          {formatNumber(item.total)} so‘m
        </Text>
        <Checkbox checked={check} />
      </div>
    </li>
  );
};

export default AnyPaymentItem;
