import { Button, Input } from "antd";
import { BackIcon } from "../../assets/icons";
import { Heading, Text } from "../../components";
import { useState, useEffect, type FormEvent } from "react";
import { useCookies } from "react-cookie";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instance } from "../../hooks/instance";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import UploadImage from "../../components/UploadImage";

const DebtorCreate = () => {
  const { id } = useParams();
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [phones, setPhones] = useState<string[]>([""]);
  const [imgNames, setImgNames] = useState<string[]>([]);
  const [isNote, setIsNote] = useState(false);
  const [sellerId] = useState<number | null>(null);

  const { data: me } = useQuery({
    queryKey: ["me-debtor"],
    queryFn: () =>
      instance()
        .get("/auth/me", {
          headers: { Authorization: `Bearer ${cookies.token}` },
        })
        .then((res) => res.data),
  });

  const { data: debtor } = useQuery({
    queryKey: ["debtor", id],
    queryFn: () =>
      instance()
        .get(`/debtor/${id}`, {
          headers: { Authorization: `Bearer ${cookies.token}` },
        })
        .then((res) => res.data),
    enabled: !!id,
  });

  useEffect(() => {
    if (id && debtor) {
      setName(debtor.name);
      setAddress(debtor.address);
      setPhones(
        debtor.Phones.length ? debtor.Phones.map((p: any) => p.phone) : [""]
      );
      setImgNames(debtor.Imgs.map((img: any) => img.img) || []);
      if (debtor.note) {
        setIsNote(true);
        setNote(debtor.note);
      }
    }
  }, [debtor]);

  const handleChangePhone = (index: number, value: string) => {
    const updated = [...phones];
    updated[index] = value;
    setPhones(updated);
  };

  const addPhone = () => {
    setPhones([...phones, ""]);
  };

  const { mutate: createDebtor } = useMutation({
    mutationFn: async (data: {
      name: string;
      address: string;
      note?: string;
      sellerId: number;
    }) => {
      const res = await instance().post("/debtor", data, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      const debtorId = res.data.id;

      await Promise.all(
        phones
          .filter((phone) => phone.trim() !== "")
          .map((phone) =>
            instance().post(
              "/phone",
              { phone, debtorId },
              { headers: { Authorization: `Bearer ${cookies.token}` } }
            )
          )
      );

      await Promise.all(
        imgNames.map((img) =>
          instance().post(
            "/image",
            { img, debtorId },
            { headers: { Authorization: `Bearer ${cookies.token}` } }
          )
        )
      );

      toast.success("Qo‘shildi");
      navigate(-1);
      queryClient.invalidateQueries({ queryKey: ["debtor-list"] });
      queryClient.invalidateQueries({ queryKey: ["add-message-debtor"] });
    },
  });

  const { mutate: updateDebtor } = useMutation({
    mutationFn: async (data: {
      name: string;
      address: string;
      note?: string;
      sellerId: number;
    }) => {
      await instance().patch(`/debtor/${id}`, data, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });

      await Promise.all(
        phones
          .filter((phone) => phone.trim() !== "")
          .map((phone) =>
            instance().post(
              "/phone",
              { phone, debtorId: Number(id) },
              { headers: { Authorization: `Bearer ${cookies.token}` } }
            )
          )
      );

      await Promise.all(
        imgNames.map((img) =>
          instance().post(
            "/image",
            { img, debtorId: Number(id) },
            { headers: { Authorization: `Bearer ${cookies.token}` } }
          )
        )
      );

      toast.success("O‘zgartirildi");
      navigate(-1);
      queryClient.invalidateQueries({ queryKey: ["single-debtor"] });
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const finalSellerId = sellerId || me?.id;
    if (!finalSellerId) {
      toast.error("Seller ID topilmadi");
      return;
    }

    const data = {
      name,
      address,
      sellerId: finalSellerId,
      note: isNote && note ? note : undefined,
    };

    if (id) {
      updateDebtor(data);
    } else {
      createDebtor(data);
    }
  };

  return (
    <div className="containers !mt-[34px]">
      <div className="flex w-[50%] !mb-[32px] justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          type="button"
          className="cursor-pointer duration-300 hover:scale-[1.2]"
        >
          <BackIcon />
        </button>
        <Heading tag="h2" classList="!text-[18px]">
          Mijoz {id ? "tahrirlash" : "yaratish"}
        </Heading>
      </div>
      <form onSubmit={handleSubmit} autoComplete="off">
        <label className=" block">
          <span className="text-[13px] font-semibold mb-[8px]">Ismi *</span>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            allowClear
            type="text"
            className="!bg-[#F6F6F6] !h-[44px]"
            size="large"
            placeholder="Ismini kiriting"
          />
        </label>

        {phones.map((_, index) => (
          <label className="!mt-[24px] block" key={index}>
            <span className="text-[13px] font-semibold mb-[8px]">
              Telefon raqami *
            </span>
            <Input
              onChange={(e) => handleChangePhone(index, e.target.value)}
              value={phones[index]}
              type="tel"
              allowClear
              className="!bg-[#F6F6F6] !h-[44px]"
              size="large"
              placeholder="Telefon raqami"
            />
          </label>
        ))}

        <Text
          onClick={addPhone}
          classList="!font-medium cursor-pointer text-end !text-[#3478F7] mt-[8px] mb-[24px]"
        >
          + Ko‘proq qo‘shish
        </Text>

        <label className="mb-[24px] block">
          <span className="text-[13px] font-semibold mb-[8px]">
            Yashash manzili *
          </span>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            allowClear
            className="!bg-[#F6F6F6] !h-[44px]"
            size="large"
            placeholder="Yashash manzilini kiriting"
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
              placeholder="Eslatma kiriting"
            />
          </label>
        ) : (
          <Button
            onClick={() => setIsNote(true)}
            htmlType="button"
            type="default"
            size="large"
            className="!h-[48px] w-full"
          >
            Eslatma qo‘shish
          </Button>
        )}

        <label className="mt-[24px] block">
          <span className="text-[13px] font-semibold block mb-[8px]">
            Rasm biriktirish
          </span>
          <UploadImage imgNames={imgNames} setImgNames={setImgNames} />
        </label>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          className="!my-[24px] !w-full !h-[49px] !font-medium !text-[18px]"
        >
          {id ? "Tahrirlash" : "Saqlash"}
        </Button>
      </form>
    </div>
  );
};

export default DebtorCreate;
