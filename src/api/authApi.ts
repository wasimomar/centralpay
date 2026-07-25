import axiosInstance from "./axiosInstance";
import type { RegisterRes } from "../interfaces";

export default async function authRegister(name: string, email: string, password: string) {
  try {
    const response = await axiosInstance.post<RegisterRes>(
      "/user/signup",
      { name, email, password }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
}

export const verifyUser = async (email: string, otp: string) => {
  try {
    const response = await axiosInstance.post("/user/verify", { email, otp });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Verification failed");
  }
};
