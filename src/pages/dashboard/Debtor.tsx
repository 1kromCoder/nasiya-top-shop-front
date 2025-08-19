import { Button, Input, Popover, Radio, Select } from "antd";
import {
  CreateDebtorIcon,
  SearchIcon,
  SliderIcon,
  StarIcon,
  StartIconActive,
} from "../../assets/icons";
import { Heading } from "../../components";
import type { DebtorType } from "../../@types/Debtor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { instance } from "../../hooks/instance";
import { formatNumber } from "../../hooks/FormatNumber";
import { useEffect, useState, type FormEvent } from "react";
import debounce from "../../hooks/debounce";
import { useNavigate } from "react-router-dom";
import type { CheckboxGroupProps } from "antd/es/checkbox";
import { PATH } from "../../hooks/Path";
import type { ClientDebtor } from "../../@types/ClientDebtor";

const Debtor = () => {
  const [cookies, , removeCookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [params, setParams] = useState<{
    name?: string;
    sortOrder?: "asc" | "desc";
    sortBy?: "createdAt" | "name" | "address";
  }>({});
  const [searchValue, setSearchValue] = useState<string>("");

  const search = debounce(searchValue, 300);

  function handleSearch(value: string | undefined) {
    setSearchValue(value || "");
  }

  const [clicked, setClicked] = useState<boolean>(false);
  const plainOptions: CheckboxGroupProps<string>["options"] = [
    { label: "ASC", value: "asc" },
    { label: "DESC", value: "desc" },
  ];
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState<"createdAt" | "name" | "address">(
    "createdAt"
  );
  const content = (
    <form onSubmit={handleSort} className="flex flex-col gap-[15px] ">
      <Select
        onChange={(e: "createdAt" | "name" | "address") => setSortBy(e)}
        style={{ width: "100%" }}
        defaultValue={"createdAt"}
        options={[
          {
            label: "CreatedAt bo'yicha",
            value: "createdAt",
          },
          {
            label: "Name bo'yicha",
            value: "name",
          },
          {
            label: "Address bo'yicha",
            value: "address",
          },
        ]}
      />
      <Radio.Group
        options={plainOptions}
        onChange={(e) => setSortOrder(e.target.value)}
        value={sortOrder}
      />
      <Button htmlType="submit" type="primary">
        Filter{" "}
      </Button>
    </form>
  );

  function handleSort(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setParams({ ...params, sortBy, sortOrder });
    setClicked(false);
  }
  useEffect(() => {
    const q = search.trim();
    setParams((prev) => {
      if (q) {
        return { ...prev, name: q };
      } else {
        const { name, ...rest } = prev;
        return rest;
      }
    });
  }, [search]);

  const { mutate: changeStar } = useMutation({
    mutationFn: (id: number) =>
      instance().patch(
        `/debtor/star/${id}`,
        {},
        { headers: { Authorization: `Bearer ${cookies.token}` } }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debtor-list"] });
    },
  });

  const { data: debtorList, isLoading } = useQuery<DebtorType[]>({
    queryKey: ["debtor-list", params],
    queryFn: () =>
      instance()
        .get("/debtor", {
          headers: { Authorization: `Bearer ${cookies.token}` },
          params,
        })
        .then((res) => res.data.data)
        .catch((err) => {
          if (err.response.status === 401) {
            removeCookies("token");
            location.pathname = "/";
          }
        }),
  });
  function handleSingleCreate(id: number) {
    queryClient.invalidateQueries({ queryKey: ["single-debtor"] });
    navigate(`${id}`);
  }
  return (
    <div className="containers relative">
      <div className="flex justify-between !mt-[30px] sticky top-[0] bg-white !z-50 items-center">
        <Input
          value={searchValue}
          allowClear
          onChange={(e) => handleSearch(e.target.value)}
          className="!bg-[#F6F6F6] border-[1px] flex text-[16px] font-medium gap-[10px] !w-[303px] !h-[48px] !rounded-[12px] py-[12px] px-[16px]"
          type="text"
          prefix={<SearchIcon />}
          size="large"
          placeholder="Mijozlarni qidirish..."
        ></Input>
        <Popover
          placement="bottomRight"
          open={clicked}
          trigger={"click"}
          content={content}
          title="Sortlash va Filtrlash"
        >
          <button
            onClick={() => setClicked(!clicked)}
            className="cursor-pointer hover:scale-[1.2] duration-300"
          >
            <SliderIcon />
          </button>
        </Popover>
      </div>

      <div>
        {isLoading ? (
          <div className="!pt-[35px]">Loading...</div>
        ) : (
          debtorList?.map((item: ClientDebtor) => (
            <div
              onClick={() => handleSingleCreate(item.id)}
              key={item.id}
              className="flex-col !gap-[4px] !bg-[#F6F6F6] flex !w-[353px] h-[143px] !rounded-[16px] !p-4 !mt-[28px] cursor-pointer duration-300 hover:scale-[1.01] relative"
            >
              <Heading tag="h2">{item?.name}</Heading>
              <p className="!text-[14px] !font-medium !text-[#1A1A1A]">
                {item?.Phones?.[0]?.phone || "Unknown"}
              </p>
              <span className="!text-[12px] !font-semibold !text-[#0e0d0d81] !mt-4">
                Jami nasiya:
              </span>
              <span className="!text-[16px] !font-medium !text-[#F94D4D]">
                {formatNumber(item?.totalDebt || 0)} so‘m
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  changeStar(item.id);
                }}
                className="absolute duration-300 hover:scale-[1.2] cursor-pointer top-[33px] right-[19px]"
              >
                {item.star ? <StartIconActive /> : <StarIcon />}
              </button>
            </div>
          ))
        )}
      </div>
      <Button
        onClick={() => navigate(PATH.debtorCreate)}
        className="!text-[16px] !fixed !right-[calc(50%-185px)] !bottom-[80px] !font-medium !h-[48px]"
        type="primary"
        size="large"
        icon={<CreateDebtorIcon />}
      >
        Yaratish
      </Button>
    </div>
  );
};

export default Debtor;
