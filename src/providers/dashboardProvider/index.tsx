"use client";

import { useContext, useReducer, useCallback } from "react";
import { App } from "antd";
import { getAxiosInstance } from "@/utils/axiosInstance";
import {
  DashboardStateContext,
  DashboardActionContext,
  INITIAL_STATE,
} from "./context";
import { DashboardReducer } from "./reducer";
import * as DashboardActions from "./actions";

export const DashboardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(DashboardReducer, INITIAL_STATE);
  const instance = getAxiosInstance();
  const { notification } = App.useApp();

  const fetchOverview = useCallback(async () => {
    dispatch(DashboardActions.fetchDashboardPending());
    try {
      const response = await instance.get("/Dashboard/overview");
      dispatch(
        DashboardActions.fetchDashboardSuccess({ overview: response.data }),
      );
    } catch {
      dispatch(DashboardActions.fetchDashboardError());
      notification.error({
        title: "Error",
        description: "Failed to fetch overview",
      });
    }
  }, [instance, notification]);

  const fetchPipelineMetrics = useCallback(async () => {
    dispatch(DashboardActions.fetchDashboardPending());
    try {
      const response = await instance.get("/Dashboard/pipeline-metrics");
      dispatch(
        DashboardActions.fetchDashboardSuccess({
          pipelineMetrics: response.data,
        }),
      );
    } catch {
      dispatch(DashboardActions.fetchDashboardError());
    }
  }, [instance]);

  const fetchSalesPerformance = useCallback(async () => {
    dispatch(DashboardActions.fetchDashboardPending());
    try {
      const response = await instance.get("/Dashboard/sales-performance");
      dispatch(
        DashboardActions.fetchDashboardSuccess({
          salesPerformance: response.data,
        }),
      );
    } catch {
      dispatch(DashboardActions.fetchDashboardError());
    }
  }, [instance]);

  const fetchActivitiesSummary = useCallback(async () => {
    dispatch(DashboardActions.fetchDashboardPending());
    try {
      const response = await instance.get("/Dashboard/activities-summary");
      dispatch(
        DashboardActions.fetchDashboardSuccess({
          activitiesSummary: response.data,
        }),
      );
    } catch {
      dispatch(DashboardActions.fetchDashboardError());
    }
  }, [instance]);

  const fetchExpiringContracts = useCallback(async () => {
    dispatch(DashboardActions.fetchDashboardPending());
    try {
      const response = await instance.get("/Dashboard/contracts-expiring");
      dispatch(
        DashboardActions.fetchDashboardSuccess({
          expiringContracts: response.data || [],
        }),
      );
    } catch {
      dispatch(DashboardActions.fetchDashboardError());
    }
  }, [instance]);

  const fetchAllDashboardData = useCallback(async () => {
    await Promise.all([
      fetchOverview(),
      fetchPipelineMetrics(),
      fetchSalesPerformance(),
      fetchActivitiesSummary(),
      fetchExpiringContracts(),
    ]);
  }, [
    fetchOverview,
    fetchPipelineMetrics,
    fetchSalesPerformance,
    fetchActivitiesSummary,
    fetchExpiringContracts,
  ]);

  return (
    <DashboardStateContext.Provider value={state}>
      <DashboardActionContext.Provider
        value={{
          fetchOverview,
          fetchPipelineMetrics,
          fetchSalesPerformance,
          fetchActivitiesSummary,
          fetchExpiringContracts,
          fetchAllDashboardData,
        }}
      >
        {children}
      </DashboardActionContext.Provider>
    </DashboardStateContext.Provider>
  );
};

export const useDashboardState = () => {
  const context = useContext(DashboardStateContext);
  if (!context)
    throw new Error("useDashboardState must be used within DashboardProvider");
  return context;
};
export const useDashboardActions = () => {
  const context = useContext(DashboardActionContext);
  if (!context)
    throw new Error(
      "useDashboardActions must be used within DashboardProvider",
    );
  return context;
};
