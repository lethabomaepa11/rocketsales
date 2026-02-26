"use client";

import { IReportStateContext } from "./context";
import * as ReportActions from "./actions";

export const ReportReducer = (
  state: IReportStateContext,
  action: { type: string; payload?: unknown },
): IReportStateContext => {
  switch (action.type) {
    case ReportActions.FETCH_OPP_REPORT_PENDING:
      return { ...state, isPending: true, isError: false };
    case ReportActions.FETCH_OPP_REPORT_SUCCESS:
      return {
        ...state,
        isPending: false,
        opportunityReport:
          action.payload as IReportStateContext["opportunityReport"],
      };
    case ReportActions.FETCH_OPP_REPORT_ERROR:
      return { ...state, isPending: false, isError: true };
    case ReportActions.FETCH_SALES_REPORT_PENDING:
      return { ...state, isPending: true, isError: false };
    case ReportActions.FETCH_SALES_REPORT_SUCCESS:
      return {
        ...state,
        isPending: false,
        salesByPeriod: action.payload as IReportStateContext["salesByPeriod"],
      };
    case ReportActions.FETCH_SALES_REPORT_ERROR:
      return { ...state, isPending: false, isError: true };
    default:
      return state;
  }
};
