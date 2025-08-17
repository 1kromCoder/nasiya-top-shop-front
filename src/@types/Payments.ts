export interface PaymentType {
  id: number;
  amount: number;
  month: number;
  months: number[];
  endDate: string;
  debtsId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
