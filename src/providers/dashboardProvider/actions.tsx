"use client";

export const FETCH_DASHBOARD_PENDING = "FETCH_DASHBOARD_PENDING";
export const FETCH_DASHBOARD_SUCCESS = "FETCH_DASHBOARD_SUCCESS";
export const FETCH_DASHBOARD_ERROR = "FETCH_DASHBOARD_ERROR";

export const fetchDashboardPending = () => ({ type: FETCH_DASHBOARD_PENDING });
export const fetchDashboardSuccess = (payload: unknown) => ({
  type: FETCH_DASHBOARD_SUCCESS,
  payload,
});
export const fetchDashboardError = () => ({ type: FETCH_DASHBOARD_ERROR });
