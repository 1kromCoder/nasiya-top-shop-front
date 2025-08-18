import { Button, Segmented } from "antd";
import { CreateExampleIcon, MessageIcon } from "../../../assets/icons";
import { Heading, Text } from "../../../components";
import { useState } from "react";
import { HistoryPayment, NotificationMessage } from "../../../modules";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { instance } from "../../../hooks/instance";
import type { NotificationType } from "../../../@types/NotificationType";
import CustomModal from "../../../components/CustomModal";
import { PhoneFormat } from "../../../hooks/PhoneFormat";
import { FindMonth } from "../../../hooks/FindMonth";
import NotificationMessageNotFound from "../../../modules/Notification/NotificationMessageNotFound";
import { useCookies } from "react-cookie";
import { PATH } from "../../../hooks/Path";

const Notification = () => {
  const [showMessage, setShowMessage] = useState<
    "Xabarlar tarixi" | "To‘lovlar tarixi"
  >("Xabarlar tarixi");
  const [showModalAddMessage, setShowModalAddMessage] =
    useState<boolean>(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["token"]);

  function handleSendMessage(id: number) {
    queryClient.invalidateQueries({ queryKey: ["debtor-notification"] });
    navigate(`${id}`);
  }

  const { data = [] } = useQuery<NotificationType[]>({
    queryKey: ["add-message-debtor"],
    queryFn: () =>
      instance()
        .get("/debtor", {
          headers: { Authorization: `Bearer ${cookies.token}` },
          params: { get: "All" },
        })
        .then((res) => res.data.data),
  });

  return (
    <>
      <div className="containers !mt-[30px] !pb-[18px] border-b-[1px] border-[#ECECEC] !mb-[16px]">
        <div className="flex items-center justify-between ">
          <Heading tag="h2" classList="!font-bold !text-[22px]">
            Hisobot
          </Heading>
          <button
            type="button"
            onClick={() => navigate(PATH.example)}
            className="cursor-pointer hover:scale-[1.2] duration-300"
          >
            {" "}
            <CreateExampleIcon />{" "}
          </button>
        </div>
      </div>
      <div className="containers">
        <Segmented
          onChange={(e: "Xabarlar tarixi" | "To‘lovlar tarixi") =>
            setShowMessage(e)
          }
          className="!w-full !h-[44px]"
          size="large"
          options={["Xabarlar tarixi", "To‘lovlar tarixi"]}
        />
        <div className="mt-[16px]">
          {showMessage == "Xabarlar tarixi" ? (
            <NotificationMessage />
          ) : (
            <HistoryPayment />
          )}
        </div>
      </div>

      <Button
        onClick={() => setShowModalAddMessage(true)}
        className="!text-[16px] !fixed !rounded-full !right-[calc(50%-185px)] !bottom-[80px] !p-0 !font-medium !h-[58px] !w-[58px]"
        type="primary"
        size="large"
        icon={<MessageIcon />}
      ></Button>
      <CustomModal show={showModalAddMessage} setShow={setShowModalAddMessage}>
        <div className="h-[50vh] overflow-y-auto">
          {data.length > 0 ? (
            data?.map((item: NotificationType) => {
              const lastSms =
                item.Sms && item.Sms?.length > 0
                  ? [...item.Sms]
                      .sort(
                        (a, b) =>
                          new Date(a.createdAt).getTime() -
                          new Date(b.createdAt).getTime()
                      )
                      .slice(-1)[0]
                  : null;

              return (
                <div
                  onClick={() => handleSendMessage(item.id)}
                  key={item.id}
                  className="flex hover:bg-slate-100 duration-300 cursor-pointer items-center justify-between py-[16px] border-b-[1px] border-[#ECECEC]"
                >
                  <div>
                    <Text classList="!font-bold !text-[14px] !mb-[8px]">
                      {item.name || "----"}
                    </Text>
                    <Text classList="!font-semibold !text-[13px]">
                      {PhoneFormat(
                        item.Phones?.length > 0
                          ? item?.Phones[0]?.phone
                          : "----"
                      )}
                    </Text>
                  </div>
                  <Text classList="!font-semibold !text-[12px]">
                    {lastSms
                      ? `${
                          lastSms.createdAt?.split("T")[0].split("-")[2]
                        } ${FindMonth(
                          Number(lastSms.createdAt?.split("T")[0].split("-")[1])
                        )}`
                      : "---"}
                  </Text>
                </div>
              );
            })
          ) : (
            <NotificationMessageNotFound />
          )}
        </div>
      </CustomModal>
    </>
  );
};

export default Notification;
