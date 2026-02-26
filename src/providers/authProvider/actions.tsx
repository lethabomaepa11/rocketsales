import { createAction } from "redux-actions";
import { IAuthStateContext, IUser } from "./context";

export enum AuthActionEnums {
  //register user
  registerUserPending = "REGISTER_STUDENT_PENDING",
  registerUserSuccess = "REGISTER_STUDENT_SUCCESS",
  registerUserError = "REGISTER_STUDENT_ERROR",
  //login user
  loginUserPending = "LOGIN_USER_PENDING",
  loginUserSuccess = "LOGIN_USER_SUCCESS",
  loginUserError = "LOGIN_USER_ERROR",
  //logout user
  logoutUser = "LOGOUT_USER",
  //set loading
  setAuthLoading = "SET_AUTH_LOADING",
}

//register user
export const registerUserPending = createAction<IAuthStateContext>(
  AuthActionEnums.registerUserPending,
  () => ({
    isPending: true,
    isError: false,
    isSuccess: false,
    isLoading: false,
  }),
);
export const registerUserError = createAction<IAuthStateContext>(
  AuthActionEnums.registerUserError,
  () => ({
    isPending: false,
    isError: true,
    isSuccess: false,
    isLoading: false,
  }),
);
export const registerUserSuccess = createAction<IAuthStateContext, IUser>(
  AuthActionEnums.registerUserSuccess,
  (user: IUser) => ({
    isPending: false,
    isError: false,
    isSuccess: true,
    isLoading: false,
    user,
  }),
);

//login user
export const loginUserPending = createAction<IAuthStateContext>(
  AuthActionEnums.loginUserPending,
  () => ({
    isPending: true,
    isError: false,
    isSuccess: false,
    isLoading: false,
  }),
);
export const loginUserError = createAction<IAuthStateContext>(
  AuthActionEnums.loginUserError,
  () => ({
    isPending: false,
    isError: true,
    isSuccess: false,
    isLoading: false,
  }),
);
export const loginUserSuccess = createAction<IAuthStateContext, IUser>(
  AuthActionEnums.loginUserSuccess,
  (user: IUser) => ({
    isPending: false,
    isError: false,
    isSuccess: true,
    isLoading: false,
    user,
  }),
);

//logout user
export const logoutUser = createAction<IAuthStateContext>(
  AuthActionEnums.logoutUser,
  () => ({
    isPending: false,
    isError: false,
    isSuccess: false,
    isLoading: false,
    user: undefined,
  }),
);

//set loading (initial auth check complete)
export const setAuthLoading = createAction<IAuthStateContext, boolean>(
  AuthActionEnums.setAuthLoading,
  (isLoading: boolean) => ({
    isLoading,
    isPending: false,
    isSuccess: false,
    isError: false,
  }),
);
