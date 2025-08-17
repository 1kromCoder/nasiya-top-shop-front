import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { instance } from "../../hooks/instance";
import type { NotificationType } from "../../@types/NotificationType";
import { Text } from "../../components";
import { PhoneFormat } from "../../hooks/PhoneFormat";
import { FindMonth } from "../../hooks/FindMonth";
import { useNavigate } from "react-router-dom";
import NotificationMessageNotFound from "./NotificationMessageNotFound";

const NotificationMessage = () => {
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();

  // Get All Messages
  const { data = [], isLoading } = useQuery<NotificationType[]>({
    queryKey: ["messages"],
    queryFn: () =>
      instance()
        .get("/debtor", {
          headers: { Authorization: `Bearer ${cookies.token}` },
        })
        .then((res) => res.data.data),
  });
  // Get All Messages
  return (
    <div>
      {isLoading ? (
        "Loading..."
      ) : data.length > 0 ? (
        data?.map((item: NotificationType) => (
          <div
            onClick={() => navigate(`${item.id}`)}
            key={item.id}
            className="flex cursor-pointer items-center justify-between py-[16px] border-b-[1px] border-[#ECECEC]"
          >
            <div>
              <Text classList="!font-bold !text-[14px] !mb-[8px]">
                {item.name}
              </Text>
              <Text classList="!font-semibold !text-[13px]">
                {PhoneFormat(
                  item.Phones?.length > 0 ? item?.Phones[0]?.phone : "----"
                )}
              </Text>
            </div>
            <Text classList="!font-semibold !text-[12px]">
              {item?.Sms[0]?.date.split("T")[0].split("-")[2]}{" "}
              {item.Sms.length > 0
                ? FindMonth(
                    Number(item?.Sms[0]?.date.split("T")[0].split("-")[1])
                  )
                : "---"}
            </Text>
          </div>
        ))
      ) : (
        <NotificationMessageNotFound />
      )}
    </div>
  );
};

export default NotificationMessage;
