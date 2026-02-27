"use client";

import { IPricingRequestStateContext } from "./context";
import * as PricingRequestActions from "./actions";

type PricingRequestItem = IPricingRequestStateContext["pricingRequests"][0];

const toArray = (payload: unknown): PricingRequestItem[] => {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object" && "items" in payload) {
    return (payload as { items: PricingRequestItem[] }).items ?? [];
  }
  return [];
};

const currentList = (
  state: IPricingRequestStateContext,
): PricingRequestItem[] =>
  Array.isArray(state.pricingRequests) ? state.pricingRequests : [];

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
        pricingRequests: Array.isArray(action.payload)
          ? action.payload
          : ((action.payload as { items?: unknown[] })?.items ?? []),
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
          action.payload as PricingRequestItem,
          ...currentList(state),
        ],
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
        pricingRequests: currentList(state).map((r) =>
          r.id === (action.payload as { id: string }).id
            ? (action.payload as PricingRequestItem)
            : r,
        ),
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
        pricingRequests: currentList(state).filter(
          (r) => r.id !== action.payload,
        ),
      };

    case PricingRequestActions.DELETE_PRICING_REQUEST_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };

    default:
      return state;
  }
};
