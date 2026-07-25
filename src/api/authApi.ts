import axios from "axios";
import type { RegisterRes } from "../interfaces";

export default async function authRegister(name: string, email: string, password: string) {
  try {
    const response = await axios.post<RegisterRes>(
      "https://central-pay-nu.vercel.app/user/signup",
      { name, email, password }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
}

export const verifyUser = async (email: string, otp: string) => {
  const response = await fetch("https://central-pay-nu.vercel.app/user/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  if (!response.ok) {
    throw new Error("Verification failed");
  }

  return response.json();
};
