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
  tenantId?: string;
  expiresAt?: string;
}

export interface IAuthStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  user?: IUser;
}

export interface IRegisterPayload {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: string;
  tenantName?: string;
  tenantId?: string;
}

export interface ILoginPayload {
  email?: string;
  password?: string;
}

export interface IAuthActionContext {
  registerUser: (user: IRegisterPayload) => void;
  loginUser: (credentials: ILoginPayload) => void;
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
