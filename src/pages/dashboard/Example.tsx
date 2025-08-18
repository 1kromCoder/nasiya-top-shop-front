import { useNavigate } from "react-router-dom";
import { BackIcon, MiniMoreIcon } from "../../assets/icons";
import { Heading, Text } from "../../components";
import type { ExampleType } from "../../@types/ExampleType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instance } from "../../hooks/instance";
import { useCookies } from "react-cookie";
import { Button, message, Modal, Popover, Switch } from "antd";
import { PATH } from "../../hooks/Path";

const Example = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const queryClient = useQueryClient();

  const { data: example, isLoading } = useQuery<ExampleType[]>({
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
  const handleEdit = (id: number) => {
    navigate(`/example/${id}/edit`);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Namunani o‘chirish",
      content: "Haqiqatan ham ushbu namunani o‘chirib tashlamoqchimisiz?",
      okText: "Ha, o‘chirish",
      cancelText: "Bekor qilish",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await instance().delete(`/example/${id}`, {
            headers: { Authorization: `Bearer ${cookies.token}` },
          });
          message.success("Namuna o‘chirildi");
          queryClient.invalidateQueries({ queryKey: ["example-get"] });
        } catch (error) {
          message.error("O‘chirishda xatolik yuz berdi");
        }
      },
    });
  };

  if (isLoading) {
    return <div className="containers !pt-[34px]">Loading...</div>;
  }

  return (
    <div className="containers !pt-[34px]">
      <div className="!pb-[11px] border-b-[1px] border-[#ECECEC]">
        <div className="w-[50%] flex justify-between ">
          <button className="cursor-pointer" onClick={() => navigate(-1)}>
            <BackIcon />
          </button>
          <Heading classList="!text-[18px]" tag="h2">
            Namunalar
          </Heading>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-[30px]">
        {example && example.length > 0 ? (
          example.map((item) => {
            const content = (
              <div className="w-[172px]">
                <Text
                  classList="!font-medium duration-300 hover:scale-[1.01] cursor-pointer border-b-[1px] border-[#ECECEC] !pb-[16px] !pt-[8px]"
                  onClick={() => handleEdit(item.id)}
                >
                  Tahrirlash
                </Text>
                <Text
                  classList="!font-medium duration-300 hover:scale-[1.01] cursor-pointer !text-[#F94D4D] !pt-[16px] !pb-[8px]"
                  onClick={() => handleDelete(item.id)}
                >
                  O‘chirish
                </Text>
              </div>
            );

            return (
              <div
                key={item.id}
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
                  <Popover
                    className="example-single-popop"
                    placement="bottomRight"
                    trigger="click"
                    content={content}
                  >
                    <button className="duration-300 hover:scale-[1.2] cursor-pointer ">
                      <MiniMoreIcon classList="scale-[1.2]" />
                    </button>
                  </Popover>
                </div>
                <Text classList="!font-normal !text-3">{item.text}</Text>
              </div>
            );
          })
        ) : (
          <div className="text-center mt-10">
            <Text classList="!font-semibold !text-[16px]">
              Mavjud namunalar yo‘q
            </Text>
            <p className="text-[#888] mt-2">
              “Qo‘shish” tugmasi orqali namuna yarating
            </p>
          </div>
        )}
      </div>

      <div className="!w-[290px] relative">
        <Button
          type="primary"
          size="large"
          onClick={() => navigate(PATH.exampleCreate)}
          className="!w-[365px] !h-[49px] !bottom-[calc(35%-185px)] !fixed bg-[#3478F7] text-white !rounded-[10px] hover:scale-[1.05] duration-300"
        >
          + Qo‘shish
        </Button>
      </div>
    </div>
  );
};

export default Example;
