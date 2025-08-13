import type { DebtsType } from "./Debts";
import type { ImageType } from "./ImageType";
import type { SellerType } from "./SellerType";

export interface PhoneType {
  phone: string;
}

export interface SingleDebtorType {
  id: number;
  name: string;
  address: string;
  note: string;
  sellerId: number;
  createdAt: string;
  updatedAt: string;
  Seller: SellerType;
  Debts?: DebtsType[];
  Phones: PhoneType[];
  totalDebt: number;
  totalPayment: number;
  Imgs: ImageType[];
  star?: boolean;
}
