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
}

//actions

//register user
export const registerUserPending = createAction<IAuthStateContext>(
  AuthActionEnums.registerUserPending,
  () => ({ isPending: true, isError: false, isSuccess: false }),
);
export const registerUserError = createAction<IAuthStateContext>(
  AuthActionEnums.registerUserError,
  () => ({ isPending: false, isError: true, isSuccess: false }),
);
export const registerUserSuccess = createAction<IAuthStateContext, IUser>(
  AuthActionEnums.registerUserSuccess,
  (user: IUser) => ({
    isPending: false,
    isError: false,
    isSuccess: true,
    user,
  }),
);

//login user
export const loginUserPending = createAction<IAuthStateContext>(
  AuthActionEnums.loginUserPending,
  () => ({ isPending: true, isError: false, isSuccess: false }),
);
export const loginUserError = createAction<IAuthStateContext>(
  AuthActionEnums.loginUserError,
  () => ({ isPending: false, isError: true, isSuccess: false }),
);
export const loginUserSuccess = createAction<IAuthStateContext, IUser>(
  AuthActionEnums.loginUserSuccess,
  (user: IUser) => ({
    isPending: false,
    isError: false,
    isSuccess: true,
    user,
  }),
);
