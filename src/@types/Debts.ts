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
  totalDebt: number;
  totalPayment: number;
  nextPayment: {
    amount: number;
    date: string;
  };
  Payments: PaymentType[];
  activePaymentsSum: number;
  monthlyAmount: number;
}

// export interface DebtsTypeWithDebtorStatus {
//   debtId: number;
//   nasiya: number;
//   tolangan: number;
//   qolgan_nasiya: number;
//   muddati: number;
//   tolangan_oyi: number;
//   qolgan_oyi: number;
// }
