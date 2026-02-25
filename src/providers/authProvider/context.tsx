"use client";

import { createContext } from "react";

export interface IUser {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  token?: string; //will be returned on successful login or registration
  password?: string; //will be used for registration and login, but should not be stored in context after successful authentication
  roles?: string[]; //will be returned on successful login or registration, used for role-based access control
}

export interface IAuthStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  user?: IUser;
}

export interface IAuthActionContext {
  registerUser: (user: IUser) => void;
  loginUser: (user: IUser) => void;
}
export const INITIAL_STATE: IAuthStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
};

//create context
export const AuthStateContext = createContext<IAuthStateContext>(INITIAL_STATE);
export const AuthActionContext = createContext<IAuthActionContext>(undefined);
