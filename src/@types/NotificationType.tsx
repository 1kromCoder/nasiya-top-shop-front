export interface NotificationType {
  id: number;
  name: string;
  address: string;
  sellerId: number;
  note: string | null;
  star: boolean;
  createdAt: string;
  updatedAt: string;
  Sms: [
    {
      id: number;
      text: string;
      debtorId: number;
      date: string;
      createdAt: string;
    }
  ];
  Phones: [
    {
      id: number;
      phone: string;
      debtorId: string;
    }
  ];
}
export interface PaymentHistoryType {
  id: number;
  debtsId: number;
  amount: number;
  createdAt: string;
  updatedAt: string;
  debts: {
    debtor: {
      id: number;
      name: string;
      address: string;
      sellerId: number;
      note: null | string;
      star: boolean;
      createdAt: string;
      updatedAt: string;
      Phones: [
        {
          id: number;
          phone: string;
          debtorId: number;
        }
      ];
    };
  };
}
export interface MessageType {
  id: number;
  text: string;
  sent: boolean;
  date: string;
  exampleId: number;
  sellerId: number;
  debtorId: number;
  createdAt: string;
  updatedAt: string;
  debtor: {
    name: string;
  };
}

