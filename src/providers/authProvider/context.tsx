"use client";

import { createContext } from "react";

export interface IUser {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  token?: string;
  password?: string;
  roles?: string[];
}

export interface IAuthStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  user?: IUser;
}

export interface IAuthActionContext {
  registerUser: (user: IUser) => void;
  loginUser: (user: IUser) => void;
  logout: () => void;
}

export const INITIAL_STATE: IAuthStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  isLoading: true,
};

export const AuthStateContext = createContext<IAuthStateContext>(INITIAL_STATE);
export const AuthActionContext = createContext<IAuthActionContext>(
  undefined as unknown as IAuthActionContext,
);
