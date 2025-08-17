import { Button, Segmented } from "antd";
import { CreateExampleIcon, MessageIcon } from "../../../assets/icons";
import { Heading } from "../../../components";
import { useState } from "react";
import { HistoryPayment, NotificationMessage } from "../../../modules";

const Notification = () => {
  const [showMessage, setShowMessage] = useState<
    "Xabarlar tarixi" | "To‘lovlar tarixi"
  >("Xabarlar tarixi");
  return (
    <>
      <div className="containers !mt-[30px] !pb-[18px] border-b-[1px] border-[#ECECEC] !mb-[16px]">
        <div className="flex items-center justify-between ">
          <Heading tag="h2" classList="!font-bold !text-[22px]">
            Hisobot
          </Heading>
          <button>
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
        className="!text-[16px] !fixed !rounded-full !right-[calc(50%-185px)] !bottom-[80px] !p-0 !font-medium !h-[58px] !w-[58px]"
        type="primary"
        size="large"
        icon={<MessageIcon />}
      ></Button>
    </>
  );
};

export default Notification;
