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
  overview: DashboardOverviewDto | null;
  pipelineMetrics: PipelineMetricsDto | null;
  activitiesSummary: ActivitiesSummaryDto | null;
  salesPerformance: SalesPerformanceDto[] | null;
  contractsExpiring: ContractExpiryDto[] | null;
  loading: boolean;
  error: string | null;
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
  overview: null,
  pipelineMetrics: null,
  activitiesSummary: null,
  salesPerformance: [],
  contractsExpiring: [],
  loading: false,
  error: null,
};

export const DashboardStateContext =
  createContext<IDashboardStateContext>(INITIAL_STATE);
export const DashboardActionContext = createContext<IDashboardActionContext>(
  undefined as unknown as IDashboardActionContext,
);
