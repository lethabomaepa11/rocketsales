import { handleActions } from "redux-actions";
import { IAuthStateContext, INITIAL_STATE } from "./context";
import { AuthActionEnums } from "./actions";

export const AuthReducer = handleActions<IAuthStateContext, IAuthStateContext>(
  {
    [AuthActionEnums.registerUserPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [AuthActionEnums.registerUserSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [AuthActionEnums.registerUserError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [AuthActionEnums.loginUserPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [AuthActionEnums.loginUserSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [AuthActionEnums.loginUserError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [AuthActionEnums.logoutUser]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [AuthActionEnums.setAuthLoading]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
  INITIAL_STATE,
);
