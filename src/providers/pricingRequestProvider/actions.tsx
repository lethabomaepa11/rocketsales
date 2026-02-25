"use client";

export const FETCH_PRICING_REQUESTS_PENDING = "FETCH_PRICING_REQUESTS_PENDING";
export const FETCH_PRICING_REQUESTS_SUCCESS = "FETCH_PRICING_REQUESTS_SUCCESS";
export const FETCH_PRICING_REQUESTS_ERROR = "FETCH_PRICING_REQUESTS_ERROR";
export const CREATE_PRICING_REQUEST_PENDING = "CREATE_PRICING_REQUEST_PENDING";
export const CREATE_PRICING_REQUEST_SUCCESS = "CREATE_PRICING_REQUEST_SUCCESS";
export const CREATE_PRICING_REQUEST_ERROR = "CREATE_PRICING_REQUEST_ERROR";
export const UPDATE_PRICING_REQUEST_PENDING = "UPDATE_PRICING_REQUEST_PENDING";
export const UPDATE_PRICING_REQUEST_SUCCESS = "UPDATE_PRICING_REQUEST_SUCCESS";
export const UPDATE_PRICING_REQUEST_ERROR = "UPDATE_PRICING_REQUEST_ERROR";
export const DELETE_PRICING_REQUEST_PENDING = "DELETE_PRICING_REQUEST_PENDING";
export const DELETE_PRICING_REQUEST_SUCCESS = "DELETE_PRICING_REQUEST_SUCCESS";
export const DELETE_PRICING_REQUEST_ERROR = "DELETE_PRICING_REQUEST_ERROR";

export const fetchPricingRequestsPending = () => ({
  type: FETCH_PRICING_REQUESTS_PENDING,
});
export const fetchPricingRequestsSuccess = (payload: unknown) => ({
  type: FETCH_PRICING_REQUESTS_SUCCESS,
  payload,
});
export const fetchPricingRequestsError = () => ({
  type: FETCH_PRICING_REQUESTS_ERROR,
});
export const createPricingRequestPending = () => ({
  type: CREATE_PRICING_REQUEST_PENDING,
});
export const createPricingRequestSuccess = (payload: unknown) => ({
  type: CREATE_PRICING_REQUEST_SUCCESS,
  payload,
});
export const createPricingRequestError = () => ({
  type: CREATE_PRICING_REQUEST_ERROR,
});
export const updatePricingRequestPending = () => ({
  type: UPDATE_PRICING_REQUEST_PENDING,
});
export const updatePricingRequestSuccess = (payload: unknown) => ({
  type: UPDATE_PRICING_REQUEST_SUCCESS,
  payload,
});
export const updatePricingRequestError = () => ({
  type: UPDATE_PRICING_REQUEST_ERROR,
});
export const deletePricingRequestPending = () => ({
  type: DELETE_PRICING_REQUEST_PENDING,
});
export const deletePricingRequestSuccess = (id: string) => ({
  type: DELETE_PRICING_REQUEST_SUCCESS,
  payload: id,
});
export const deletePricingRequestError = () => ({
  type: DELETE_PRICING_REQUEST_ERROR,
});
