import axios from "axios";

const token = localStorage.getItem("token");

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Authorization: token ? `Bearer ${token}` : null,
  },
});
