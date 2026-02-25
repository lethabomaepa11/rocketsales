import axios from "axios";

export const getAxiosInstance = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 30000,
    headers: { 
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

export const setAuthToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const removeAuthToken = () => {
  localStorage.removeItem("token");
};
