import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { instance } from "../../hooks/instance";
import type { PaymentHistoryType } from "../../@types/NotificationType";
import { Text } from "../../components";
import { PhoneFormat } from "../../hooks/PhoneFormat";
import { formatNumber } from "../../hooks/FormatNumber";
import NotificationMessageNotFound from "./NotificationMessageNotFound";

const HistoryPayment = () => {
  const [cookies] = useCookies(["token"]);

  const { data = [], isLoading } = useQuery<PaymentHistoryType[]>({
    queryKey: ["history-payment"],
    queryFn: () =>
      instance()
        .get("/payments", {
          headers: { Authorization: `Bearer ${cookies.token}` },
        })
        .then((res) => res.data),
  });

  return (
    <div>
      {isLoading ? (
        "Loading..."
      ) : data.length > 0 ? (
        data.map((item, index) => {
          const currentDate = item.createdAt.split("T")[0];
          const prevDate =
            index > 0 ? data[index - 1].createdAt.split("T")[0] : null;

          return (
            <div key={item.id} className="cursor-pointer">
              {index === 0 || currentDate !== prevDate ? (
                <Text classList="!text-center !text-[12px] !text-[#3478F7] !mt-[24px] !font-semibold">
                  {currentDate}
                </Text>
              ) : null}

              <div className="flex items-center justify-between py-[16px] border-b border-[#ECECEC]">
                <div>
                  <Text classList="!font-bold !text-[14px] !mb-[8px]">
                    {item?.debts?.debtor?.name || "----"}
                  </Text>
                  <Text classList="!font-semibold !text-[13px]">
                    {PhoneFormat(
                      item?.debts?.debtor?.Phones?.[0]?.phone || "Unknown"
                    )}
                  </Text>
                </div>
                <Text classList="!font-medium !text-[16px]">
                  -{item.amount ? formatNumber(item.amount) : "----"}
                </Text>
              </div>
            </div>
          );
        })
      ) : (
        <NotificationMessageNotFound />
      )}
    </div>
  );
};

export default HistoryPayment;
