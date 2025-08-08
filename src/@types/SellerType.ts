import type { DebtorType } from "./Debtor";
import type { DebtsType } from "./Debts";

export interface SellerType {
  id: number;
  name: string;
  phone: string;
  email: string;
  balance: number;
  password: string;
  img: string;
  createdAt: string;
  updatedAt: string;
  // Debtor: Array<DebtorType>;
  // Debts: Array<DebtsType>;
  Debts: DebtsType[];
  Debtor?: DebtorType[];
  totalDebt: number;
  overdueDebts: Array<{}>;
  wallet?: number;
}
