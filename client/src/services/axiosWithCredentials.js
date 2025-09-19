import axios from "axios";

const axiosWithCredentials = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Optional: request interceptor (attach tokens)
// axiosWithCredentials.interceptors.request.use((config) => {
//   const token = localStorage.getItem("access_token"); 
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default axiosWithCredentials;