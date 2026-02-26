"use client";

import { useContext, useReducer, useCallback } from "react";
import { App } from "antd";
import { getAxiosInstance } from "@/utils/axiosInstance";
import {
  ReportStateContext,
  ReportActionContext,
  INITIAL_STATE,
} from "./context";
import { ReportReducer } from "./reducer";
import * as ReportActions from "./actions";
import { ReportOpportunityParams, SalesByPeriodParams } from "./types";

export const ReportProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(ReportReducer, INITIAL_STATE);
  const instance = getAxiosInstance();
  const { notification } = App.useApp();

  const fetchOpportunityReport = useCallback(
    async (params?: ReportOpportunityParams) => {
      dispatch(ReportActions.fetchOppReportPending());
      try {
        const response = await instance.get("/Reports/opportunities", {
          params,
        });
        dispatch(ReportActions.fetchOppReportSuccess(response.data || []));
      } catch {
        dispatch(ReportActions.fetchOppReportError());
        notification.error({ message: "Failed to fetch opportunity report" });
      }
    },
    [instance, notification],
  );

  const fetchSalesByPeriod = useCallback(
    async (params?: SalesByPeriodParams) => {
      dispatch(ReportActions.fetchSalesReportPending());
      try {
        const response = await instance.get("/Reports/sales-by-period", {
          params,
        });
        dispatch(ReportActions.fetchSalesReportSuccess(response.data || []));
      } catch {
        dispatch(ReportActions.fetchSalesReportError());
        notification.error({ message: "Failed to fetch sales report" });
      }
    },
    [instance, notification],
  );

  return (
    <ReportStateContext.Provider value={state}>
      <ReportActionContext.Provider
        value={{ fetchOpportunityReport, fetchSalesByPeriod }}
      >
        {children}
      </ReportActionContext.Provider>
    </ReportStateContext.Provider>
  );
};

export const useReportState = () => {
  const context = useContext(ReportStateContext);
  if (!context)
    throw new Error("useReportState must be used within ReportProvider");
  return context;
};
export const useReportActions = () => {
  const context = useContext(ReportActionContext);
  if (!context)
    throw new Error("useReportActions must be used within ReportProvider");
  return context;
};
