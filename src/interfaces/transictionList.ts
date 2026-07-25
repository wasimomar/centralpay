export interface Transaction {
  _id: string;
  sender: string;
  amount: number;
  date: string;
  type: "sent" | "received";
  device: string;
}