import { useNavigate, useParams } from "react-router-dom";
import { Heading, Text } from "../../components";
import { ArrowIcon, BackIcon } from "../../assets/icons";
import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instance } from "../../hooks/instance";
import { useCookies } from "react-cookie";
import { FindMonth } from "../../hooks/FindMonth";
import { Button, Input } from "antd";
import SuccessModal from "../../components/SuccessModal";
import type { DebtsType } from "../../@types/Debts";
import { formatNumber } from "../../hooks/FormatNumber";
import CustomModal from "../../components/CustomModal";
import AnyPaymentItem from "../../components/AnyPaymentItem";

const DebtPayment = () => {
  const { debtId: debtsId } = useParams();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const [showForMonthPayment, setShowForMonthPayment] =
    useState<boolean>(false);
  const [showAnyPayment, setShowAnyPayment] = useState<boolean>(false);
  const [showChooseDatePayment, setShowChooseDatePayment] =
    useState<boolean>(false);

  const { data: debtData } = useQuery<DebtsType>({
    queryKey: ["single-debt"],
    queryFn: () =>
      instance()
        .get(`/debts/${debtsId}`, {
          headers: { Authorization: `Bearer ${cookies.token}` },
        })
        .then((res) => res.data),
  });



  // one month
  const { mutate: oneMonthMutate, isPending: oneMonthPenning } = useMutation({
    mutationFn: (data: { debtsId: string | undefined; month: number }) =>
      instance().post("/payments", data, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      }),
    onSuccess: () => {
      setShowSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["single-debt"] });
      queryClient.invalidateQueries({ queryKey: ["single-debtor"] });
      queryClient.invalidateQueries({ queryKey: ["history-payment"] });
    },
    onError: (error: any) => {
      console.error("Error occurred:", error);
    },
  });
  function handleShowSuccess() {
    oneMonthMutate({
      debtsId,
      month: 1,
    });
  }

  // one month
  // any payment
  const { mutate: oneAnyPayment, isPending: anyPaymenPenning } = useMutation({
    mutationFn: (data: { debtsId: string | undefined; amount: number }) =>
      instance().post("/payments", data, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      }),
    onSuccess: () => {
      setShowSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["single-debt"] });
      queryClient.invalidateQueries({ queryKey: ["single-debtor"] });
      queryClient.invalidateQueries({ queryKey: ["history-payment"] });
    },
  });

  function handleSubmitAnyPayment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const amountValue = +(e.target as HTMLFormElement).amount.value;
    oneAnyPayment({
      debtsId,
      amount: amountValue,
    });
  }

  // any payment

  // Choose date to pay
  const [totolPay, setTotalPay] = useState<number[]>([]);
  const [payAll, setPayAll] = useState(false);
  const [payMonth, setPayMonth] = useState<Array<number>>([]);
  const { mutate: oneManyPayment, isPending: manyPaymenPenning } = useMutation({
    mutationFn: (data: { debtsId: string | undefined; months: number[] }) =>
      instance().post("/payments", data, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      }),

    onSuccess: () => {
      setShowSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["single-debt"] });
      queryClient.invalidateQueries({ queryKey: ["single-debtor"] });
      queryClient.invalidateQueries({ queryKey: ["history-payment"] });
    },
    onError: (error: any) => {
      console.error("Error occurred:", error);
    },
  });

  function handleManyMonthClick() {
    oneManyPayment({
      debtsId,
      months: payMonth,
    });
  }
  function handlePayAll() {
    setPayAll((_prev: boolean) => {
      if (!payAll) {
        setPayMonth(
          debtData?.Payments ? debtData?.Payments.map((item) => item.month) : []
        );
        setTotalPay(
          debtData?.Payments
            ? debtData?.Payments.map((item) => item.amount)
            : []
        );
        return true;
      } else {
        setPayMonth([]);
        setTotalPay([]);

        return false;
      }
    });
  }

  function addAmount(arr: number[]) {
    if (arr.length > 0) {
      let total = arr?.reduce((value: number, item: number) => {
        return (value += item);
      });
      return formatNumber(total);
    }
  }
  console.log(debtData, "debtData");

  return (
    <>
      <div className="containers !mt-[30px]">
        <div className="flex items-center justify-between mb-[27px] w-[50%] gap-[12px]">
          <button className="cursor-pointer" onClick={() => navigate(-1)}>
            {" "}
            <BackIcon />{" "}
          </button>
          <Heading tag="h2">Nasiyani so‘ndirish</Heading>
        </div>
        <Heading classList="!text-[18px] !mb-[20px]" tag="h2">
          To‘lov
        </Heading>
        <ul>
          <li
            onClick={() => setShowForMonthPayment(true)}
            className="flex items-center justify-between cursor-pointer py-[16px] border-b-[1px] border-[#EEEEEE]"
          >
            <Text classList="!text-[14px] font-normal">1 oyga so‘ndirish</Text>
            <button className="rotate-[180deg]">
              <ArrowIcon classList="payment-debt" />
            </button>
          </li>
          <li
            onClick={() => setShowAnyPayment(true)}
            className="flex items-center justify-between cursor-pointer py-[16px] border-b-[1px] border-[#EEEEEE]"
          >
            <Text classList="!text-[14px] font-normal">
              Har qanday miqdorda so‘ndirish
            </Text>
            <button className="rotate-[180deg]">
              <ArrowIcon classList="payment-debt" />
            </button>
          </li>
          <li
            onClick={() => setShowChooseDatePayment(true)}
            className="flex items-center justify-between cursor-pointer py-[16px] border-b-[1px] border-[#EEEEEE]"
          >
            <Text classList="!text-[14px] font-normal">
              To‘lov muddatini tanlash
            </Text>
            <button className="rotate-[180deg]">
              <ArrowIcon classList="payment-debt" />
            </button>
          </li>
        </ul>
      </div>
      <CustomModal show={showForMonthPayment} setShow={setShowForMonthPayment}>
        <Heading classList="!font-bold !text-[20px]" tag="h2">
          1 oy uchun so‘ndirish
        </Heading>
        <div className="p-4 rounded-[16px] bg-[#DDE9FE] mt-[32px] mb-[200px]">
          <Heading
            classList="!font-bold !text-[16px] !mb-[4px] text-[#3478F7]"
            tag="h3"
          >
            {formatNumber(
              debtData?.monthlyAmount ? debtData?.monthlyAmount : 0
            )}{" "}
            so‘m
          </Heading>
          <Text>
            {FindMonth(
              Number(
                debtData?.Payments[0]?.endDate?.split("T")[0]?.split("-")[1]
              ) - 1
            )}{" "}
            oyi uchun so‘ndiriladi
          </Text>
        </div>
        <Button
          loading={oneMonthPenning}
          onClick={handleShowSuccess}
          className="!h-[42px] !font-medium !text-[14px] w-full"
          size="large"
          htmlType="button"
          type="primary"
        >
          1 oylik uchun so‘ndirish
        </Button>
      </CustomModal>
      <CustomModal show={showAnyPayment} setShow={setShowAnyPayment}>
        <form onSubmit={handleSubmitAnyPayment} autoComplete="off">
          <Heading classList="!font-bold !text-[20px] !mb-[32px]" tag="h2">
            Har qanday miqdorda so‘ndirish
          </Heading>
          <label className="!mb-[215px] block">
            <span className="text-[13px] font-semibold mb-[8px]">
              Miqdorni kiriting *
            </span>
            <Input
              type="number"
              allowClear
              className="!bg-[#F6F6F6] !h-[44px]"
              size="large"
              name="amount"
              placeholder="To‘lov miqdori"
            />
          </label>
          <Button
            loading={anyPaymenPenning}
            className="!h-[42px] !font-medium !text-[14px] w-full"
            size="large"
            htmlType="submit"
            type="primary"
          >
            So‘ndirish
          </Button>
        </form>
      </CustomModal>
      <CustomModal
        show={showChooseDatePayment}
        setShow={setShowChooseDatePayment}
      >
        <Heading classList="!font-bold !text-[20px]" tag="h2">
          To‘lov muddatini tanlang
        </Heading>
        <div className="flex items-center justify-between mt-[22px] pb-[22px] border-b-[1px] border-[#ECECEC]">
          <div>
            <Text classList="!text-[14px] !font-medium">So‘ndirish:</Text>
            <Text classList="!text-[16px] !font-bold text-[#3478F7]">
              {addAmount(totolPay) ? addAmount(totolPay) : 0} so‘m
            </Text>
          </div>
          <button
            onClick={handlePayAll}
            className="text-[14px] font-bold text-[#3478F7] cursor-pointer hover:scale-[1.1] duration-300"
          >
            Hammasini tanlang
          </button>
        </div>
        <ul>
          {debtData?.Payments?.map((item, index) => (
            <AnyPaymentItem
              setTotalPay={setTotalPay}
              payAll={payAll}
              item={item}
              key={item.id}
              index={index}
              setPayMonth={setPayMonth}
              payMonth={payMonth}
            />
          ))}
        </ul>

        <Button
          loading={manyPaymenPenning}
          onClick={handleManyMonthClick}
          className="!h-[42px] !mt-[16px] !font-medium !text-[14px] w-full"
          size="large"
          htmlType="submit"
          type="primary"
        >
          So‘ndirish
        </Button>
      </CustomModal>

      {showSuccess && <SuccessModal />}
    </>
  );
};

export default DebtPayment;
