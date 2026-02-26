import axios from "axios";

export const getAxiosInstance = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const tenantId = typeof window !== "undefined" ? localStorage.getItem("tenantId") : null;

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(tenantId ? { "X-Tenant-Id": tenantId } : {}),
    },
  });
};

export const setAuthToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const setTenantId = (tenantId: string) => {
  localStorage.setItem("tenantId", tenantId);
};

export const getTenantId = (): string | null => {
  return typeof window !== "undefined" ? localStorage.getItem("tenantId") : null;
};

export const removeAuthToken = () => {
  localStorage.removeItem("token");
};

export const removeTenantId = () => {
  localStorage.removeItem("tenantId");
};
