"use client";

import { createContext } from "react";
import {
  PricingRequestDto,
  CreatePricingRequestDto,
  UpdatePricingRequestDto,
  PricingRequestQueryParams,
} from "./types";

export interface IPricingRequestStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  pricingRequests: PricingRequestDto[];
  selectedPricingRequest: PricingRequestDto | null;
  pagination: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface IPricingRequestActionContext {
  fetchPricingRequests: (params?: PricingRequestQueryParams) => void;
  fetchPricingRequestById: (id: string) => void;
  fetchPendingRequests: () => void;
  fetchMyRequests: () => void;
  createPricingRequest: (request: CreatePricingRequestDto) => void;
  updatePricingRequest: (id: string, request: UpdatePricingRequestDto) => void;
  deletePricingRequest: (id: string) => void;
  completePricingRequest: (id: string) => void;
  assignPricingRequest: (id: string, userId: string) => void;
}

export const INITIAL_STATE: IPricingRequestStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  pricingRequests: [],
  selectedPricingRequest: null,
  pagination: { pageNumber: 1, pageSize: 10, totalCount: 0, totalPages: 0 },
};

export const PricingRequestStateContext =
  createContext<IPricingRequestStateContext>(INITIAL_STATE);
export const PricingRequestActionContext =
  createContext<IPricingRequestActionContext>(
    undefined as unknown as IPricingRequestActionContext,
  );
