import { useNavigate, useParams } from "react-router-dom";
import { Heading } from "../../components";
import { BackIcon } from "../../assets/icons";
import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  Select,
  type CheckboxChangeEvent,
} from "antd";
import { useState, type FormEvent } from "react";
import dayjs from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instance } from "../../hooks/instance";
import { useCookies } from "react-cookie";
import toast from "react-hot-toast";
import UploadImage from "../../components/UploadImage";
import type { DebtsType } from "../../@types/Debts";

export const termList = [
  { value: 1, label: "1 oy" },
  { value: 2, label: "2 oy" },
  { value: 3, label: "3 oy" },
  { value: 4, label: "4 oy" },
  { value: 5, label: "5 oy" },
  { value: 6, label: "6 oy" },
];

const DebtCreate = () => {
  const { id: debtorId, debtId } = useParams();
  const [cookies] = useCookies(["token"]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [productName, setProductName] = useState<string>("");
  const [date, setDate] = useState<string>();
  const [time, setTime] = useState<any>("");
  const [amount, setAmount] = useState<number>();
  const [period, setPeriod] = useState<number>();

  const [isNote, setIsNote] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");
  const [images, setImages] = useState<Array<string>>([]);

  function checkToday(e: CheckboxChangeEvent) {
    if (e.target.checked) {
      setTime(dayjs());
      setDate(dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"));
    } else {
      setTime(null);
    }
  }
  function chooseDate(date: any) {
    setTime(date);
    setDate(date.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"));
  }

  const { mutate: createDebt } = useMutation({
    mutationFn: async (data: any) => {
      const res = await instance().post("/debts", data, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });

      if (images.length > 0) {
        await Promise.all(
          images.map((item: any) => {
            instance().post(
              "/images-debts",
              { img: item, debtsId: res.data.id },
              { headers: { Authorization: `Bearer ${cookies.token}` } }
            );
          })
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["single-debtor"] });
      toast.success("Yaratildi");
      navigate(-1);
    },
    onError: (err: any) => {
      console.log(err, "error creating debt");
    },
  });
  

  const { mutate: updateDebt } = useMutation({
    mutationFn: async (data: any) => {
      const res = await instance().patch(`/debts/${debtId}`, data, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });

      if (images.length > 0) {
        await Promise.all(
          images.map((item: any) => {
            if (item) {
              return instance().post(
                "/images-debts",
                { img: item, debtsId: Number(debtId) },
                { headers: { Authorization: `Bearer ${cookies.token}` } }
              );
            }
          })
        );
      }

      return res;
    },
    onSuccess: () => {
      toast.success("O'zgardi");
      queryClient.invalidateQueries({ queryKey: ["single-debt"] });
      navigate(-1);
    },
  });

  const createDebtSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(images, "date");

    const data: Partial<DebtsType> = {
      productName,
      date,
      amount,
      period,
      note,
      time,
      debtorId: debtorId ? Number(debtorId) : undefined,
    };

    if (debtId) {
      updateDebt(data);
    } else {
      createDebt(data);
    }
  };

  useQuery({
    queryKey: ["update-debt"],
    queryFn: () =>
      debtId
        ? instance()
            .get(`/debts/${debtId}`, {
              headers: { Authorization: `Bearer ${cookies.token}` },
            })
            .then((res) => {
              setProductName(res.data.productName);
              setAmount(res.data.amount);
              setTime(dayjs(res.data.time));
              setPeriod(res.data.period);
              setDate(res.data.date);
              setImages(res.data.ImageDebts.map((img: any) => img.img));
              if (res.data.note) {
                setIsNote(true);
                setNote(res.data.note);
              }
              return {};
            })
        : {},
  });

  return (
    <div className="containers !mt-[30px]">
      <div className="flex w-[50%] !mb-[26px] justify-between items-center ">
        <button
          onClick={() => navigate(-1)}
          type="button"
          className="cursor-pointer duration-300 hover:scale-[1.2]"
        >
          {" "}
          <BackIcon />{" "}
        </button>
        <Heading tag="h2" classList="!text-[18px]">
          Nasiya {debtId ? "tahrirlash" : "yaratish"}
        </Heading>
      </div>
      <form onSubmit={createDebtSubmit} autoComplete="off">
        <label className=" block">
          <span className="text-[13px] font-semibold mb-[8px]">
            Mahsulot nomi *
          </span>
          <Input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            allowClear
            type="text"
            className="!bg-[#F6F6F6] !h-[44px]"
            size="large"
            name="username"
            placeholder="Ismini kiriting"
          />
        </label>
        <label className="mt-[24px] block">
          <span className="text-[13px] font-semibold mb-[8px]">
            Mahsulot Narxi *
          </span>
          <Input
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            allowClear
            type="number"
            className="!bg-[#F6F6F6] !h-[44px]"
            size="large"
            name="amount"
            placeholder="Narx kiriting"
          />
        </label>
        <div className="debt-date-picker flex justify-between items-end mt-[24px]">
          <label className="w-[70%] flex flex-col">
            <span className="text-[13px] font-semibold mb-[8px]">Sana</span>
            <DatePicker
              className="!h-[44px]"
              value={time}
              onChange={chooseDate}
              size="large"
            />
          </label>
          <Checkbox
            onChange={checkToday}
            className="!mb-[10px] !text-[14px] !font-medium"
          >
            Bugun
          </Checkbox>
        </div>
        <label className="my-[24px]  flex flex-col">
          <span className="text-[13px] font-semibold  mb-[8px]">Muddat</span>
          <Select
            className="!h-[44px]"
            value={period}
            size="large"
            allowClear
            showSearch
            placeholder="Qarz muddatini tanlang"
            optionFilterProp="label"
            onChange={(e) => setPeriod(e)}
            options={termList}
          />
        </label>
        {isNote ? (
          <label className="mb-[24px] block">
            <span className="text-[13px] font-semibold mb-[8px]">Eslatma</span>
            <Input.TextArea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              allowClear
              className="!bg-[#F6F6F6]"
              size="large"
              name="note"
              placeholder="Eslatma kiriting"
            />
          </label>
        ) : (
          <Button
            onClick={() => setIsNote(true)}
            htmlType="button"
            type="default"
            size="large"
            className="!h-[48px] mb-[24px] w-full"
          >
            Izoh qo‘shish
          </Button>
        )}
        <UploadImage imgNames={images} setImgNames={setImages} />
        <Button
          htmlType="submit"
          type="primary"
          size="large"
          className="!h-[49px] !w-full !mt-[32px] !text-[18px] !font-medium"
        >
          {debtId ? "Tahrirlash" : "Saqlash"}
        </Button>
      </form>
    </div>
  );
};

export default DebtCreate;
