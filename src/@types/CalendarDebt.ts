import type { DebtorType } from "./Debtor";

export interface CalendarUniqForDayType {
  id: number;
  amount: number;
  month: number;
  endDate: string;
  debtsId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  debts: {
    id: number;
    date: string;
    time: string;
    period: number;
    amount: number;
    note: string;
    debtorId: number;
    createdAt: string;
    updatedAt: string;
    debtor: DebtorType;
  };
}

export interface CalendarType {
  unpaidForDay: Array<CalendarUniqForDayType>;
  totalForMonth: number;
}

