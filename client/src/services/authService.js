// src/api/axiosClient.ts
import axios from "axios";
import axiosWithCredentials from "./axiosWithCredentials";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const AuthApi = {
  SignUpService: async (data) => await axiosClient.post("/auth/signup", data),
  SignInService: async (data) => await axiosWithCredentials.post("/auth/signin", data),
  ForgotPasswordService: async (data) =>
   await axiosClient.post("/auth/forgotpassword", data),
  SignOutService: async () => await axiosWithCredentials.post("/auth/signout", {}),
};
