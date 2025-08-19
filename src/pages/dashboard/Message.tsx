import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { Heading, Text } from "../../components";
import {
  BackIcon,
  CreateExampleIcon,
  SendMessageIcon,
} from "../../assets/icons";
import { message, Modal, Popover, Switch } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instance } from "../../hooks/instance";
import type { MessageType } from "../../@types/NotificationType";
import { FindMonth } from "../../hooks/FindMonth";
import { useState, type FormEvent } from "react";
import CustomModal from "../../components/CustomModal";
import type { ExampleType } from "../../@types/ExampleType";

const NotificationMessage = () => {
  const { debtorId } = useParams();
  const [cookies] = useCookies(["token"]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const date = new Date();
  const [open, setOpen] = useState(false);

  const { data = [], isLoading } = useQuery<MessageType[]>({
    queryKey: ["debtor-notification", debtorId],
    queryFn: () =>
      instance()
        .get("/sms", {
          headers: { Authorization: `Bearer ${cookies.token}` },
          params: { debtorId },
        })
        .then((res) => res.data.data),
    enabled: !!debtorId,
  });

  const { data: example } = useQuery<ExampleType[]>({
    queryKey: ["example-get"],
    queryFn: () =>
      instance()
        .get("/example", {
          headers: { Authorization: `Bearer ${cookies.token}` },
        })
        .then((res) => res.data),
  });

  const changeActiveMutation = useMutation({
    mutationFn: (payload: { id: number; isActive: boolean }) =>
      instance().patch(
        `/example/${payload.id}`,
        { isActive: payload.isActive },
        { headers: { Authorization: `Bearer ${cookies.token}` } }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["example-get"] });
    },
  });

  const [text, setText] = useState<string>("");
  const { mutate } = useMutation({
    mutationFn: (data: { text: string; debtorId: number; date: string }) =>
      instance().post("/sms", data, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["debtor-notification", debtorId],
      });
      setText("");
    },
    onError: (error: any) => {
      console.error("Error creating message:", error);
    },
  });

  function handleCreateMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (text.trim() && debtorId) {
      const data = {
        text: text.trim(),
        debtorId: Number(debtorId),
        date: date.toISOString(),
      };

      mutate(data);
    }
  }

  const handleDelete = () => {
    Modal.confirm({
      title: "Smslarni o‘chirish",
      content:
        "Haqiqatan ham ushbu mijozni smslarini o‘chirib tashlamoqchimisiz?",
      okText: "Ha, o‘chirish",
      cancelText: "Bekor qilish",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await instance().delete(`/sms/${debtorId}`, {
            headers: { Authorization: `Bearer ${cookies.token}` },
          });
          message.success("Smslar o‘chirildi");
          queryClient.invalidateQueries({ queryKey: ["messages"] });
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
        classList="!font-medium !rounded-[10px] p-1 text-center !bg-blue-600 duration-300 hover:scale-[1.01] cursor-pointer !text-white"
        onClick={handleDelete}
      >
        O'chirish
      </Text>
    </div>
  );

  return (
    <>
      <div className="containers">
        <div className="flex fixed top-0 pt-[30px] w-full bg-white max-w-[400px] items-center border-b-[1px] border-[#ECECEC] justify-between pb-[11px] z-50 mb-[28px]">
          <button
            className="cursor-pointer duration-300 hover:scale-[1.2]"
            onClick={() => navigate(-1)}
          >
            {" "}
            <BackIcon />{" "}
          </button>
          <Heading tag="h2">
            {data.length > 0 ? data[0]?.debtor?.name : "---"}
          </Heading>
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
        <div className="mt-[80px] space-y-[20px]">
          {isLoading
            ? "Loading..."
            : data.map((item, index) => (
                <div key={item.id}>
                  <Text classList="font-medium !text-[12px] !text-center">
                    {index == 0
                      ? `${item.date?.split("T")[0].split("-")[2]} ${FindMonth(
                          Number(item.date?.split("T")[0].split("-")[1])
                        )}`
                      : Number(
                          data[index]?.date?.split("T")[0].split("-")[2]
                        ) ==
                        Number(
                          data[index - 1]?.date?.split("T")[0]?.split("-")[2]
                        )
                      ? ""
                      : `${item.date?.split("T")[0].split("-")[2]} ${FindMonth(
                          Number(item.date?.split("T")[0].split("-")[1])
                        )}`}
                  </Text>
                  <div className="p-4 ml-auto relative max-w-[300px] !mt-[20px] rounded-[16px] bg-[#F5F5F5]">
                    <Text classList="font-normal !text-[16px] ">
                      {item.text}
                    </Text>
                    <span className="text-[12px] absolute bottom-[2px] right-[8px]">
                      {item.createdAt?.split("T")[1].split(".")[0]}
                    </span>
                  </div>
                </div>
              ))}
        </div>
        <form
          onSubmit={handleCreateMessage}
          autoComplete="off"
          className="flex fixed w-full max-w-[400px] bg-white py-[8px] bottom-[60px] mx-auto justify-between items-center"
        >
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="cursor-pointer hover:scale-[1.2] duration-300"
          >
            {" "}
            <CreateExampleIcon />{" "}
          </button>
          <div className="w-[90%] flex items-center justify-between pr-[18px] bg-[#F5F5F5] rounded-[50px]">
            <input
              onChange={(e) => setText(e.target.value)}
              value={text}
              className="w-[90%] py-[12px] outline-none pl-[16px]"
              type="text"
              placeholder="Xabar yuborish..."
            />
            <button
              type="submit"
              className="cursor-pointer hover:scale-[1.2] duration-300"
            >
              {" "}
              <SendMessageIcon />{" "}
            </button>
          </div>
        </form>
      </div>
      <CustomModal show={open} setShow={setOpen}>
        <div className="containers">
          <Heading tag="h2" classList="!text-[18px] !mb-[20px]">
            Xabar namunalari
          </Heading>
          <Text classList="!text-[14px] !mb-[12px]">
            Siz yuborishingiz mumkin bo'lgan xabar namunalarini tanlang.
          </Text>

          {example && example.length > 0 ? (
            <div className="flex flex-col gap-4">
              {example.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setText(item.text);
                    setOpen(false);
                  }}
                  className="p-4 cursor-pointer rounded-[16px] bg-[#F6F6F6]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Switch
                      checked={item.isActive}
                      onChange={(e) =>
                        changeActiveMutation.mutate({
                          isActive: e.valueOf(),
                          id: item.id,
                        })
                      }
                    />
                  </div>
                  <Text classList="!font-normal !text-3">{item.text}</Text>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center mt-6">
              <Text classList="!font-medium !text-[15px] text-gray-500">
                Sizda hali namunalar yo‘q
              </Text>
            </div>
          )}
        </div>
      </CustomModal>
    </>
  );
};

export default NotificationMessage;
