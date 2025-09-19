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
  SignUpService: (data) => axiosClient.post("/auth/signup", data),
  SignInService: (data) => axiosClient.post("/auth/signin", data),
  ForgotPasswordService: (data) => axiosClient.post("/auth/forgotpassword", data),
  SignOutService: () => axiosWithCredentials.post("/auth/signout", {}),
};
