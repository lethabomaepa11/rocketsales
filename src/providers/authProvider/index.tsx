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
} from "./actions";
import {
  AuthActionContext,
  AuthStateContext,
  INITIAL_STATE,
  IUser,
} from "./context";
import { AuthReducer } from "./reducer";
import { App } from "antd";
import { getAxiosInstance, removeAuthToken } from "@/utils/axiosInstance";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  const instance = getAxiosInstance();
  const { notification } = App.useApp();

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
    }
  }, []);

  const registerUser = async (user: IUser) => {
    dispatch(registerUserPending());
    try {
      await instance.post("/auth/register", user);
      dispatch(registerUserSuccess(user));
      notification.success({
        message: "Successfully signed up! Please login.",
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: string } };
      notification.error({
        message: "Failed to signup",
        description: err.response?.data || "An error occurred",
      });
      dispatch(registerUserError());
    }
  };

  const loginUser = async (user: IUser) => {
    dispatch(loginUserPending());
    try {
      const response = await instance.post("/auth/login", user);
      const { data } = response;

      localStorage.setItem("token", data.token || "");
      localStorage.setItem("user", JSON.stringify(data));

      dispatch(loginUserSuccess(data));
      notification.success({ message: "Successfully logged in!" });
    } catch (error: unknown) {
      const err = error as { response?: { data?: string } };
      notification.error({
        message: "Login failed",
        description: err.response?.data || "Invalid credentials",
      });
      dispatch(loginUserError());
    }
  };

  const logout = () => {
    removeAuthToken();
    localStorage.removeItem("user");
    dispatch(logoutUser());
    notification.success({ message: "Logged out successfully" });
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
