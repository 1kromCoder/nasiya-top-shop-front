import type { DebtsType } from "./Debts";

export interface ClientDebtor {
  id: number;
  name: string;
  address: string;
  note: string;
  sellerId: number;
  createdAt: string;
  updatedAt: string;
  Seller: {
    id: number;
    name: string;
    phone: string;
    email: string;
    balance: number;
    password: string;
    img: string;
    createdAt: string;
    updatedAt: string;
  };
  Debts?: DebtsType[];
  Phones: { phone: string }[];
  totalDebt: number;
  star?: boolean;
}
