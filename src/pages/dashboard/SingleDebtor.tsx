import { useNavigate, useParams } from "react-router-dom";
import {
  BackIcon,
  CreateDebtorIcon,
  MoreOutlined,
  StarIcon,
  StartIconActive,
} from "../../assets/icons";
import { Heading, Text } from "../../components";
import { Button, Popover, Modal, message } from "antd";
import { useCookies } from "react-cookie";
import type { SingleDebtorType } from "../../@types/SingleDebtorType";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { instance } from "../../hooks/instance";
import { formatNumber } from "../../hooks/FormatNumber";

const SingleDebtor = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [cookies, removeCookies] = useCookies(["token"]);
  const { id } = useParams();

  const { data: SingleDebtor, isLoading } = useQuery<SingleDebtorType>({
    queryKey: ["single-debtor", id],
    queryFn: () =>
      instance()
        .get(`/debtor/${id}`, {
          headers: { Authorization: `Bearer ${cookies.token}` },
        })
        .then((res) => res.data)
        .catch((err) => {
          if (err.response?.status === 401) {
            removeCookies("token", "", { path: "/" });
            location.pathname = "/";
          }
        }),
  });

  const handleEdit = () => {
    navigate(`/debtor/${id}/edit`);
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Mijozni o‘chirish",
      content: "Haqiqatan ham ushbu mijozni o‘chirib tashlamoqchimisiz?",
      okText: "Ha, o‘chirish",
      cancelText: "Bekor qilish",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await instance().delete(`/debtor/${id}`, {
            headers: { Authorization: `Bearer ${cookies.token}` },
          });
          message.success("Mijoz o‘chirildi");
          queryClient.invalidateQueries({ queryKey: ["debtor-list"] });
          navigate(-1);
        } catch (error) {
          message.error("O‘chirishda xatolik yuz berdi");
        }
      },
    });
  };

  function showDebtorDebt(id: string) {
    queryClient.invalidateQueries({ queryKey: ["single-debt"] });
    navigate(`debts/${id}`);
  }

  const content = (
    <div className="w-[172px]">
      <Text
        classList="!font-medium duration-300 hover:scale-[1.01] cursor-pointer border-b-[1px] border-[#ECECEC] !pb-[16px] !pt-[8px]"
        onClick={handleEdit}
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

  const emtyPage = (
    <div className="text-center w-[252px] mx-auto mt-[100px]">
      <Heading classList="!font-bold !mb-2 !text-4" tag="h2">
        Mijozda hali nasiya mavjud emas
      </Heading>
      <Text classList="!font-normal !text-[14px]">
        Nasiya yaratish uchun pastagi "+" tugmasini bosing
      </Text>
    </div>
  );

  function findPrecent(Debt: any) {
    if (!Debt) return 0;
    return 100 - (+Debt.activePaymentsSum / +Debt.amount) * 100;
  }

  return (
    <div className="containers !mt-[34px] relative">
      <div className="flex items-center mb-[20px] justify-between">
        <div className="flex items-center gap-5">
          <button className="cursor-pointer" onClick={() => navigate(-1)}>
            <BackIcon />
          </button>
          <Heading tag="h2">{isLoading ? "----" : SingleDebtor?.name}</Heading>
        </div>
        <div className="flex items-center gap-[14px]">
          <button className="duration-300 debtor-single hover:scale-[1.2] cursor-pointer">
            {SingleDebtor?.star ? <StartIconActive /> : <StarIcon />}
          </button>
          <Popover
            className="debtor-single-popop"
            placement="bottomRight"
            trigger="click"
            content={content}
          >
            <button className="duration-300 hover:scale-[1.2] cursor-pointer ">
              <MoreOutlined classList="scale-[1.2]" />
            </button>
          </Popover>
        </div>
      </div>

      <div className="rounded-[20px] bg-[#BBD2FC] py-[18px] pl-[18px] !mb-6">
        <Text classList="!text-3">Umumiy nasiya</Text>
        <strong className="font-bold text-[#000] text-[22px]">
          {formatNumber(SingleDebtor?.totalDebt ?? 0)} so'm
        </strong>
      </div>
      <Heading classList="!mb-4" tag="h2">
        Faol nasiyalar
      </Heading>
      <div className="flex flex-col gap-4">
        {isLoading
          ? "Loading..."
          : (SingleDebtor?.Debts?.length ?? 0) === 0
          ? emtyPage
          : SingleDebtor?.Debts?.map((item: any) => {
              const nextPayment = item;
              return (
                <div
                  onClick={() => showDebtorDebt(item.id)}
                  key={item.id}
                  className="p-4 cursor-pointer rounded-[16px] bg-[#F6F6F6]"
                >
                  <div className="flex items-center justify-between mb-5">
                    <Text classList="!font-medium !text-[14px]">
                      {item.date?.split("T")[0] ?? "-"} {item.time ?? ""}
                    </Text>
                    <Text classList="!font-medium text-[#3478F7]">
                      {formatNumber(item.activePaymentsSum)} so'm
                    </Text>
                  </div>
                  <Text classList="!font-normal !text-3 ">
                    Keyingi to'lov:{" "}
                    {nextPayment?.date ? nextPayment.date.split("T")[0] : "-"}
                  </Text>
                  <strong className="block mb-4">
                    <span className="font-extrabold text-[#735CD8] text-4">
                      {formatNumber(nextPayment?.monthlyAmount ?? 0)}
                    </span>
                  </strong>
                  <div className="w-full h-[8px] rounded-full bg-[#CCCCCC] relative">
                    <span
                      style={{
                        width: `${findPrecent(item)}%`,
                      }}
                      className={`h-[100%] absolute rounded-full bg-[#30AF49]`}
                    ></span>
                  </div>
                </div>
              );
            })}
      </div>
      <Button
        onClick={() => navigate(`/debtors/${id}/create-debt`)}
        className="!text-[16px] !fixed !right-[calc(50%-185px)] !bottom-[80px] !font-medium !h-[48px]"
        type="primary"
        size="large"
        icon={<CreateDebtorIcon />}
      >
        Qo'shish
      </Button>
    </div>
  );
};

export default SingleDebtor;
