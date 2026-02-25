"use client";

import { createContext } from "react";
import {
  DashboardOverviewDto,
  PipelineMetricsDto,
  SalesPerformanceDto,
  ActivitiesSummaryDto,
  ContractExpiryDto,
} from "./types";

export interface IDashboardStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  overview: DashboardOverviewDto | null;
  pipelineMetrics: PipelineMetricsDto | null;
  salesPerformance: SalesPerformanceDto | null;
  activitiesSummary: ActivitiesSummaryDto | null;
  expiringContracts: ContractExpiryDto[];
}

export interface IDashboardActionContext {
  fetchOverview: () => void;
  fetchPipelineMetrics: () => void;
  fetchSalesPerformance: () => void;
  fetchActivitiesSummary: () => void;
  fetchExpiringContracts: () => void;
  fetchAllDashboardData: () => void;
}

export const INITIAL_STATE: IDashboardStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  overview: null,
  pipelineMetrics: null,
  salesPerformance: null,
  activitiesSummary: null,
  expiringContracts: [],
};

export const DashboardStateContext =
  createContext<IDashboardStateContext>(INITIAL_STATE);
export const DashboardActionContext = createContext<IDashboardActionContext>(
  undefined as unknown as IDashboardActionContext,
);
