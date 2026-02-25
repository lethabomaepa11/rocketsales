"use client";

import { IPricingRequestStateContext } from "./context";
import * as PricingRequestActions from "./actions";

export const PricingRequestReducer = (
  state: IPricingRequestStateContext,
  action: { type: string; payload?: unknown },
): IPricingRequestStateContext => {
  switch (action.type) {
    case PricingRequestActions.FETCH_PRICING_REQUESTS_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case PricingRequestActions.FETCH_PRICING_REQUESTS_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        pricingRequests:
          action.payload as IPricingRequestStateContext["pricingRequests"],
      };
    case PricingRequestActions.FETCH_PRICING_REQUESTS_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };
    case PricingRequestActions.CREATE_PRICING_REQUEST_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case PricingRequestActions.CREATE_PRICING_REQUEST_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        pricingRequests: [
          action.payload,
          ...state.pricingRequests,
        ] as IPricingRequestStateContext["pricingRequests"],
      };
    case PricingRequestActions.CREATE_PRICING_REQUEST_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };
    case PricingRequestActions.UPDATE_PRICING_REQUEST_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case PricingRequestActions.UPDATE_PRICING_REQUEST_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        pricingRequests: state.pricingRequests.map((r) =>
          r.id === (action.payload as { id: string }).id
            ? (action.payload as IPricingRequestStateContext["pricingRequests"][0])
            : r,
        ) as IPricingRequestStateContext["pricingRequests"],
      };
    case PricingRequestActions.UPDATE_PRICING_REQUEST_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };
    case PricingRequestActions.DELETE_PRICING_REQUEST_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case PricingRequestActions.DELETE_PRICING_REQUEST_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        pricingRequests: state.pricingRequests.filter(
          (r) => r.id !== action.payload,
        ) as IPricingRequestStateContext["pricingRequests"],
      };
    case PricingRequestActions.DELETE_PRICING_REQUEST_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };
    default:
      return state;
  }
};
