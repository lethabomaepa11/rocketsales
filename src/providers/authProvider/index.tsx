"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useReducer } from "react";
import {
  loginUserError,
  loginUserPending,
  loginUserSuccess,
  registerUserError,
  registerUserPending,
  registerUserSuccess,
} from "./actions";
import {
  AuthActionContext,
  AuthStateContext,
  INITIAL_STATE,
  IUser,
} from "./context";
import { AuthReducer } from "./reducer";
import { App } from "antd";
import { getAxiosInstance } from "@/utils/axiosInstance";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  const instance = getAxiosInstance();
  const { notification } = App.useApp();

  const registerUser = async (user: IUser) => {
    dispatch(registerUserPending());
    await instance
      .post("/auth/register", user)
      .then(() => {
        dispatch(registerUserSuccess(user));
        notification.success({
          title: "Successfully signed up",
        });
      })
      .catch((error) => {
        notification.error({
          title: "Failed to signup",
          description: error,
        });

        dispatch(registerUserError());
        notification.success({
          title: "Successfully signed up",
        });
      });
  };

  const loginUser = async (user: IUser) => {
    dispatch(loginUserPending());
    await instance
      .post("/auth/login", user)
      .then((response) => {
        const { data } = response;
        dispatch(loginUserSuccess(data));
        localStorage.setItem("token", data.token || "");
        notification.success({
          title: "Successfully logged in",
        });
      })
      .catch((error) => {
        console.error(error);
        dispatch(loginUserError());
      });
  };

  return (
    <AuthStateContext.Provider value={state}>
      <AuthActionContext.Provider value={{ registerUser, loginUser }}>
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
