import { useNavigate } from "react-router-dom";
import { BackIcon } from "../../assets/icons";
import { Heading } from "../../components";
import { useQuery } from "@tanstack/react-query";
import type { SellerType } from "../../@types/SellerType";
import { instance } from "../../hooks/instance";
import { useCookies } from "react-cookie";
import { API } from "../../hooks/getEnv";
import { Avatar } from "../../assets/images";
import { Input } from "antd";

const MyProfile = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);

  const { data: myprofile, isLoading } = useQuery<SellerType>({
    queryKey: ["my-seller"],
    queryFn: () =>
      instance()
        .get("/auth/me", {
          headers: { Authorization: `Bearer ${cookies.token}` },
        })
        .then((res) => res.data)
        .catch((err) => {
          if (err.response.status == 401) {
            location.pathname = "/";
          }
        }),
  });

  if (isLoading) {
    return <div className="containers !mt-[40px]">Loading...</div>;
  }

  return (
    <div className="containers !pt-[32px]">
      <div className="w-[70%] flex justify-between">
        <button className="cursor-pointer" onClick={() => navigate(-1)}>
          <BackIcon />
        </button>
        <Heading classList="!text-[18px]" tag="h2">
          Shaxsiy ma’lumotlar
        </Heading>
      </div>

      <div className="flex items-center justify-between !flex-col !mt-[25px]">
        <img
          className="rounded-full"
          src={`${myprofile?.img ? `${API}/file/${myprofile.img}` : Avatar}`}
          alt="Avatar"
          width={96}
          height={96}
        />

        <form autoComplete="off" className="flex flex-col gap-[32px] mt-[32px]">
          <label className="block">
            <span className="text-[13px] inline-block font-semibold mb-[8px]">
              Ismi familiya
            </span>
            <Input
              allowClear
              type="text"
              className="!bg-[#F6F6F6] !h-[44px]"
              size="large"
              defaultValue={myprofile?.name}
            />
          </label>

          <label className="block">
            <span className="text-[13px] inline-block font-semibold !mb-[8px]">
              Telefon raqami
            </span>
            <Input
              type="tel"
              allowClear
              className="!bg-[#F6F6F6] !h-[44px]"
              size="large"
              defaultValue={myprofile?.phone}
            />
          </label>

          <label className="block">
            <span className="text-[13px] inline-block font-semibold !mb-[8px]">
              Elektron pochta
            </span>
            <Input
              allowClear
              className="!bg-[#F6F6F6] !h-[44px]"
              size="large"
              defaultValue={myprofile?.email}
            />
          </label>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;
