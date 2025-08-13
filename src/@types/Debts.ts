import type { PaymentType } from "./Payments";

export interface DebtsType {
  id: number;
  productName: string;
  date: string;
  time: string;
  period: number;
  amount: number;
  note: string;
  debtorId: number;
  sellerId: number;
  ImageDebts: string[];
  createdAt: string;
  updatedAt: string;
  totalPayment: number;
  nextPayment: {
    amount: number;
    date: string;
  };
  Payment: PaymentType[];
  activePaymentsSum: number;
  monthlyAmount: number;
}
