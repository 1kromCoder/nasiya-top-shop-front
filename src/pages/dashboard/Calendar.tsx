import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { instance } from "../../hooks/instance";
import { useCookies } from "react-cookie";
import type {
  CalendarType,
  CalendarUniqForDayType,
} from "../../@types/CalendarDebt";
import { BackIcon } from "../../assets/icons";
import { CustomCalendar, Heading, Text } from "../../components";
import { FindMonth } from "../../hooks/FindMonth";
import { formatNumber } from "../../hooks/FormatNumber";

const Calendar = () => {
  const [nowDate, setNowDate] = useState<dayjs.Dayjs | undefined>();
  const [cookies, , removeCookies] = useCookies(["token"]);
  const navigate = useNavigate();

  const { data: debtsList, isLoading } = useQuery<CalendarType>({
    queryKey: ["all-debts", nowDate],
    queryFn: () =>
      instance()
        .get("/debts/date", {
          params: {
            date: nowDate
              ? `${(nowDate as any)?.$y}-${(nowDate as any)?.$M + 1}-${
                  (nowDate as any)?.$D
                }`
              : 0,
          },
          headers: { Authorization: `Bearer ${cookies.token}` },
        })
        .then((res) => res.data.data)
        .catch((err) => {
          if (err.response.status === 401) {
            removeCookies("token");
            location.pathname = "/";
          }
        }),
  });

  return (
    <>
      <div className="containers !pt-[34px] mb-[44px]">
        <div className="w-[50%] flex justify-between">
          <button className="cursor-pointer" onClick={() => navigate(-1)}>
            <BackIcon />
          </button>
          <Heading classList="!text-[18px]" tag="h2">
            Kalendar
          </Heading>
        </div>

        <CustomCalendar
          totalForMonth={
            isLoading
              ? 0
              : debtsList?.totalForMonth
              ? debtsList.totalForMonth
              : 0
          }
          setNowDate={setNowDate}
          nowDate={nowDate}
        />

        <div className="p-4 mt-[14px] bg-[#F6F6F6] rounded-t-[16px]">
          <div className="containers">
            <Text classList="!mb-[20px]">
              {nowDate && (nowDate as any).$D}{" "}
              {nowDate && FindMonth((nowDate as any).$M)} kuni to‘lov kutilmoqda
            </Text>

            <div>
              {isLoading
                ? "-"
                : debtsList?.unpaidForDay.map(
                    (item: CalendarUniqForDayType) => (
                      <div
                        key={item.id}
                        className="bg-[#FFFFFF] p-[14px] rounded-[16px]"
                      >
                        <Heading tag="h3">{item.debts.debtor.name}</Heading>
                        <Text classList="!font-normal">
                          UZS {formatNumber(item.amount)}
                        </Text>
                      </div>
                    )
                  )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Calendar;
