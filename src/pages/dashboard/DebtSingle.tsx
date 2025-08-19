import { useNavigate, useParams } from "react-router-dom";
import { BackIcon } from "../../assets/icons";
import { Heading, PageLoading, Text } from "../../components";
import { MoreOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Input,
  message,
  Modal,
  Popover,
  Select,
} from "antd";
import { termList } from "./DebtCreate";
import { API } from "../../hooks/getEnv";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instance } from "../../hooks/instance";
import { useCookies } from "react-cookie";
import dayjs from "dayjs";
import { useState } from "react";
import { formatNumber } from "../../hooks/FormatNumber";
import CustomModal from "../../components/CustomModal";

const DebtSingle = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState<boolean>(false);
  const { debtId } = useParams();

  const { data: singleDebt, isLoading } = useQuery({
    queryKey: ["single-debt"],
    queryFn: () =>
      instance()
        .get(`/debts/${debtId}`, {
          headers: { Authorization: `Bearer ${cookies.token}` },
        })
        .then((res) => {
          if (res.data.note) {
          }
          return res.data;
        }),
  });

  const { mutate: deleteDebtor, isPending } = useMutation({
    mutationFn: (id: string | undefined) =>
      instance().delete(`/debts/${id}`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      }),
    onSuccess: () => {
      setShowModal(false);
      navigate(-1);
      queryClient.invalidateQueries({ queryKey: ["single-debtor"] });
    },
  });

  function handleUpdateBtnClick() {
    navigate("update");
    queryClient.invalidateQueries({ queryKey: ["update-debt"] });
  }

  const handleDelete = () => {
    Modal.confirm({
      title: "Mijozni o‘chirish",
      content: "Haqiqatan ham ushbu mijozni o‘chirib tashlamoqchimisiz?",
      okText: "Ha, o‘chirish",
      cancelText: "Bekor qilish",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await instance().delete(`/debts/${debtId}`, {
            headers: { Authorization: `Bearer ${cookies.token}` },
          });
          message.success("Mijoz o‘chirildi");
          queryClient.invalidateQueries({ queryKey: ["single-debtor"] });
          navigate(-1);
        } catch (error) {
          message.error("O‘chirishda xatolik yuz berdi");
        }
      },
    });
  };
  const content = (
    <div className="w-[172px]">
      <Text
        classList="!font-medium duration-300 hover:scale-[1.01] cursor-pointer border-b-[1px] border-[#ECECEC] !pb-[16px] !pt-[8px]"
        onClick={() => handleUpdateBtnClick()}
      >
        Tahrirlash
      </Text>
      <Text
        classList="!font-medium duration-300 hover:scale-[1.01] cursor-pointer !text-[#F94D4D] !pt-[16px] !pb-[8px]"
        onClick={handleDelete}
      >
        O'chirish
      </Text>
    </div>
  );

  return (
    <div className="containers !mt-[30px]">
      {isLoading ? (
        <PageLoading />
      ) : (
        <>
          <div className="flex items-center justify-between mb-[36px]">
            <button
              className="cursor-pointer duration-300 hover:scale-[1.2]"
              onClick={() => navigate(-1)}
            >
              {" "}
              <BackIcon />{" "}
            </button>
            <Heading tag="h2">Batafsil</Heading>
            <Popover
              className="debtor-single-popop"
              placement="bottomRight"
              content={content}
              trigger="click"
            >
              <button>
                {" "}
                <MoreOutlined className="!text-[24px] cursor-pointer duration-300 hover:scale-[1.2]" />{" "}
              </button>
            </Popover>
          </div>
          <div className="debt-date-picker flex justify-between items-end mt-[24px] mb-[24px]">
            <label className="w-[70%] flex flex-col">
              <span className="text-[13px] font-semibold mb-[8px]">Sana</span>
              <DatePicker
                readOnly
                className="!h-[44px]"
                value={dayjs(singleDebt?.date)}
                size="large"
              />
            </label>
            <label className="w-[28%] flex flex-col">
              <span className="text-[13px] font-semibold mb-[8px]">Vaqt</span>
              <Input
                readOnly
                className="!h-[44px] !bg-[#F6F6F6]"
                value={singleDebt?.time ?? "00:00:00"}
                size="large"
              />
            </label>
          </div>
          <label className="my-[24px] flex flex-col">
            <span className="text-[13px] font-semibold mb-[8px]">Muddat</span>
            <Select
              // disabled
              className="!h-[44px]"
              value={singleDebt?.period}
              size="large"
              options={termList}
            />
          </label>
          <label className="mt-[24px] block">
            <span className="text-[13px] font-semibold mb-[8px]">
              Summa miqdori{" "}
            </span>
            <Input
              readOnly
              className="!h-[44px] !bg-[#F6F6F6]"
              value={formatNumber(singleDebt?.amount ?? 0)}
              size="large"
            />
          </label>
          {singleDebt?.note ? (
            <label className="mt-[24px] block">
              <span className="text-[13px] font-semibold mb-[8px]">
                Eslatma
              </span>
              <Input.TextArea
                readOnly
                value={singleDebt?.note}
                rows={4}
                className="!bg-[#F6F6F6]"
                size="large"
              />
            </label>
          ) : (
            ""
          )}
          {singleDebt?.ImageDebts?.length > 0 && (
            <label className="mt-[24px] block">
              <span className="text-[13px] font-semibold mb-[8px]">
                Rasmlar
              </span>
              <div className="flex justify-between flex-wrap">
                {singleDebt.ImageDebts.map((item: any) => (
                  <img
                    key={item.id}
                    className="w-[48%] rounded-[16px] h-[112px]"
                    src={`${API}${item.img}`}
                    alt="Debt img"
                    width={300}
                    height={300}
                  />
                ))}
              </div>
            </label>
          )}

          <Button
            onClick={() => navigate("payment")}
            type="primary"
            htmlType="submit"
            size="large"
            className="!my-[24px] !w-full !h-[49px] !font-medium !text-[18px]"
          >
            Nasiyani so‘ndirish
          </Button>
        </>
      )}
      <CustomModal show={showModal} setShow={setShowModal}>
        <Heading tag="h2">O'chirmoqchisiz?</Heading>
        <div className="flex items-center justify-between mt-3">
          <Button
            loading={isPending}
            onClick={() => deleteDebtor(debtId)}
            className="w-[100%] "
            size="large"
            type="primary"
            htmlType="button"
          >
            Tasdiqlash
          </Button>
        </div>
      </CustomModal>
    </div>
  );
};

export default DebtSingle;
