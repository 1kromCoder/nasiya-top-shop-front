import { useNavigate, useParams } from "react-router-dom";
import { BackIcon } from "../../assets/icons";
import { Heading } from "../../components";
import { Button, Input } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instance } from "../../hooks/instance";
import { useCookies } from "react-cookie";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import type { ExampleType } from "../../@types/ExampleType";

const ExampleCreate = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const queryClient = useQueryClient();
  const [text, setText] = useState<string>("");

  const { id } = useParams();

  const { data: example, isLoading } = useQuery<ExampleType>({
    queryKey: ["example-get-one", id],
    queryFn: () =>
      instance()
        .get(`/example/${id}`, {
          headers: { Authorization: `Bearer ${cookies.token}` },
        })
        .then((res) => res.data),
    enabled: !!id,
  });

  useEffect(() => {
    if (example) {
      setText(example.text);
    }
  }, [example]);


  const { mutate: saveExample, isPending } = useMutation({
    mutationFn: async (data: { text: string; isActive: boolean }) => {
      if (id) {
        return instance().patch(`/example/${id}`, data, {
          headers: { Authorization: `Bearer ${cookies.token}` },
        });
      } else {
        return instance().post("/example", data, {
          headers: { Authorization: `Bearer ${cookies.token}` },
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["example-get"] });
      toast.success(id ? "Tahrirlandi" : "Yaratildi");
      navigate(-1);
    },
    onError: (err: any) => {
      console.log(err, "error saving example");
      toast.error("Xatolik yuz berdi!");
    },
  });

  const handleSubmit = () => {
    if (!text.trim()) {
      toast.error("Matn kiritilishi shart!");
      return;
    }

    saveExample({
      text,
      isActive: true,
    });
  };

  return (
    <div className="containers !pt-[34px]">
      <div className="!pb-[11px] border-b-[1px] border-[#ECECEC]">
        <div className="w-[60%] flex justify-between">
          <button className="cursor-pointer" onClick={() => navigate(-1)}>
            <BackIcon />
          </button>
          <Heading classList="!text-[18px]" tag="h2">
            {id ? "Namuna tahrirlash" : "Namuna yaratish"}
          </Heading>
        </div>
      </div>

      {isLoading && id ? (
        <p className="mt-10">Yuklanmoqda...</p>
      ) : (
        <>
          <label className="mb-[24px] block mt-[40px]">
            <span className="text-[13px] font-bold inline-block mb-[8px]">
              Namuna
            </span>
            <Input.TextArea
              rows={4}
              allowClear
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="!bg-[#F6F6F6]"
              size="large"
              placeholder="Matn yozish..."
            />
          </label>
          <div className="mt-[360px] relative">
            <Button
              type="primary"
              size="large"
              onClick={handleSubmit}
              disabled={isPending}
              className="!w-[365px] !h-[49px] !fixed bg-[#3478F7] text-white !rounded-[10px] hover:scale-[1.05] duration-300 disabled:opacity-50"
            >
              {isPending ? "Saqlanmoqda..." : id ? "Saqlash" : "Yaratish"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ExampleCreate;
