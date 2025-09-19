import axios from "axios";

const axiosWithCredentials = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Access-Control-Allow-Origin': '*', 
    "Content-Type": "application/json",
  },
});

export default axiosWithCredentials;