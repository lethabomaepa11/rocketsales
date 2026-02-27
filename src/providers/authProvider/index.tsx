"use client";

import { useContext, useReducer, useEffect } from "react";
import {
  loginUserError,
  loginUserPending,
  loginUserSuccess,
  registerUserError,
  registerUserPending,
  registerUserSuccess,
  logoutUser,
  setAuthLoading,
} from "./actions";
import {
  AuthActionContext,
  AuthStateContext,
  INITIAL_STATE,
  IUser,
  ILoginPayload,
  IRegisterPayload,
} from "./context";
import { AuthReducer } from "./reducer";
import { App } from "antd";
import { getAxiosInstance, removeAuthToken } from "@/utils/axiosInstance";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  const instance = getAxiosInstance();
  const { message } = App.useApp();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      if (token && userStr) {
        try {
          const userData = JSON.parse(userStr);
          dispatch(loginUserSuccess({ ...userData }));
        } catch {
          removeAuthToken();
        }
      }
      // Mark initial auth check as complete (regardless of whether user is logged in)
      dispatch(setAuthLoading(false));
    }
  }, []);

  const registerUser = async (user: IRegisterPayload) => {
    dispatch(registerUserPending());
    try {
      const payload: IRegisterPayload = {
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: user.role,
        tenantName: user.tenantName,
        tenantId: user.tenantId,
      };
      const response = await instance.post("/Auth/register", payload);
      const { data } = response;

      // backend returns a LoginResponseDto which includes token and user info
      const userData: IUser = {
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        token: data.token,
        roles: data.roles,
        tenantId: data.tenantId,
        expiresAt: data.expiresAt,
      };

      dispatch(registerUserSuccess(userData));
      message.success("Successfully signed up! Please login.");
      localStorage.setItem("token", data.token || "");
      localStorage.setItem("tenantId", data.tenantId || "");
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error: unknown) {
      const err = error as { response?: { data?: string } };
      message.error("Failed to signup: " + (err.response?.data || ""));
      dispatch(registerUserError());
    }
  };

  const loginUser = async (credentials: ILoginPayload) => {
    dispatch(loginUserPending());
    try {
      const payload = {
        email: credentials.email,
        password: credentials.password,
      };
      const response = await instance.post("Auth/login", payload);
      const { data } = response;

      // Extract user data with multi-tenancy support
      const userData: IUser = {
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        token: data.token,
        roles: data.roles,
        tenantId: data.tenantId,
        expiresAt: data.expiresAt,
      };

      localStorage.setItem("token", data.token || "");
      localStorage.setItem("tenantId", data.tenantId || "");
      localStorage.setItem("user", JSON.stringify(userData));

      dispatch(loginUserSuccess(userData));
      message.success("Successfully logged in!");
    } catch (error: unknown) {
      const err = error as { response?: { data?: string } };
      const msg = "Invalid credentials";
      message.error("Login failed: " + msg);
      dispatch(loginUserError());
    }
  };

  const logout = () => {
    removeAuthToken();
    localStorage.removeItem("user");
    localStorage.removeItem("tenantId");
    dispatch(logoutUser());
    message.success("Logged out successfully");
  };

  return (
    <AuthStateContext.Provider value={state}>
      <AuthActionContext.Provider value={{ registerUser, loginUser, logout }}>
        {children}
      </AuthActionContext.Provider>
    </AuthStateContext.Provider>
  );
};

export const useAuthState = () => {
  const context = useContext(AuthStateContext);
  if (!context) {
    throw new Error("useAuthState must be used within a AuthProvider");
  }
  return context;
};

export const useAuthActions = () => {
  const context = useContext(AuthActionContext);
  if (!context) {
    throw new Error("useAuthActions must be used within a AuthProvider");
  }
  return context;
};
