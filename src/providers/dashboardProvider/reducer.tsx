"use client";

import { IDashboardStateContext } from "./context";
import * as DashboardActions from "./actions";

export const DashboardReducer = (
  state: IDashboardStateContext,
  action: { type: string; payload?: unknown },
): IDashboardStateContext => {
  switch (action.type) {
    case DashboardActions.FETCH_DASHBOARD_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case DashboardActions.FETCH_DASHBOARD_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        ...(action.payload as Partial<IDashboardStateContext>),
      };
    case DashboardActions.FETCH_DASHBOARD_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };
    default:
      return state;
  }
};
