"use client";

import { createContext } from "react";
import {
  OpportunityReportItem,
  SalesByPeriodItem,
  ReportOpportunityParams,
  SalesByPeriodParams,
} from "./types";

export interface IReportStateContext {
  isPending: boolean;
  isError: boolean;
  opportunityReport: OpportunityReportItem[];
  salesByPeriod: SalesByPeriodItem[];
}

export interface IReportActionContext {
  fetchOpportunityReport: (params?: ReportOpportunityParams) => void;
  fetchSalesByPeriod: (params?: SalesByPeriodParams) => void;
}

export const INITIAL_STATE: IReportStateContext = {
  isPending: false,
  isError: false,
  opportunityReport: [],
  salesByPeriod: [],
};

export const ReportStateContext =
  createContext<IReportStateContext>(INITIAL_STATE);
export const ReportActionContext = createContext<IReportActionContext>(
  undefined as unknown as IReportActionContext,
);
