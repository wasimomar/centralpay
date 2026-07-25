import vodafoneCash from "../assets/senders/vodafone-cash.png";
import orangeCash from "../assets/senders/orange-cash.png";
import instapay from "../assets/senders/instapay.png";
import defaultSender from "../assets/senders/default-sender.png";

export const getSenderIcon = (sender: string) => {
  const value = sender.toLowerCase();

  if (value.includes("vodafone")) {
    return vodafoneCash;
  }

  if (value.includes("orange")) {
    return orangeCash;
  }

  if (value.includes("instapay")) {
    return instapay;
  }

  return defaultSender;
};