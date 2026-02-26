"use client";

export const FETCH_OPP_REPORT_PENDING = "FETCH_OPP_REPORT_PENDING";
export const FETCH_OPP_REPORT_SUCCESS = "FETCH_OPP_REPORT_SUCCESS";
export const FETCH_OPP_REPORT_ERROR = "FETCH_OPP_REPORT_ERROR";
export const FETCH_SALES_REPORT_PENDING = "FETCH_SALES_REPORT_PENDING";
export const FETCH_SALES_REPORT_SUCCESS = "FETCH_SALES_REPORT_SUCCESS";
export const FETCH_SALES_REPORT_ERROR = "FETCH_SALES_REPORT_ERROR";

export const fetchOppReportPending = () => ({ type: FETCH_OPP_REPORT_PENDING });
export const fetchOppReportSuccess = (payload: unknown) => ({
  type: FETCH_OPP_REPORT_SUCCESS,
  payload,
});
export const fetchOppReportError = () => ({ type: FETCH_OPP_REPORT_ERROR });

export const fetchSalesReportPending = () => ({
  type: FETCH_SALES_REPORT_PENDING,
});
export const fetchSalesReportSuccess = (payload: unknown) => ({
  type: FETCH_SALES_REPORT_SUCCESS,
  payload,
});
export const fetchSalesReportError = () => ({
  type: FETCH_SALES_REPORT_ERROR,
});
