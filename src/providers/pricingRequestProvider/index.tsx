"use client";

import { useContext, useReducer, useCallback } from "react";
import { App } from "antd";
import { getAxiosInstance } from "@/utils/axiosInstance";
import {
  PricingRequestStateContext,
  PricingRequestActionContext,
  INITIAL_STATE,
} from "./context";
import { PricingRequestReducer } from "./reducer";
import * as PricingRequestActions from "./actions";
import {
  CreatePricingRequestDto,
  UpdatePricingRequestDto,
  PricingRequestQueryParams,
} from "./types";

export const PricingRequestProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(PricingRequestReducer, INITIAL_STATE);
  const instance = getAxiosInstance();
  const { notification } = App.useApp();

  const fetchPricingRequests = useCallback(
    async (params?: PricingRequestQueryParams) => {
      dispatch(PricingRequestActions.fetchPricingRequestsPending());
      try {
        const response = await instance.get("/PricingRequests", { params });
        dispatch(
          PricingRequestActions.fetchPricingRequestsSuccess(
            response.data.items || [],
          ),
        );
      } catch {
        dispatch(PricingRequestActions.fetchPricingRequestsError());
        notification.error({
          title: "Error",
          description: "Failed to fetch pricing requests",
        });
      }
    },
    [instance, notification],
  );

  const fetchPricingRequestById = useCallback(
    async (id: string) => {
      dispatch(PricingRequestActions.fetchPricingRequestsPending());
      try {
        const response = await instance.get(`/PricingRequests/${id}`);
        dispatch(
          PricingRequestActions.fetchPricingRequestsSuccess([response.data]),
        );
      } catch {
        dispatch(PricingRequestActions.fetchPricingRequestsError());
      }
    },
    [instance],
  );

  const fetchPendingRequests = useCallback(async () => {
    dispatch(PricingRequestActions.fetchPricingRequestsPending());
    try {
      const response = await instance.get("/PricingRequests/pending");
      dispatch(
        PricingRequestActions.fetchPricingRequestsSuccess(response.data || []),
      );
    } catch {
      dispatch(PricingRequestActions.fetchPricingRequestsError());
    }
  }, [instance]);

  const fetchMyRequests = useCallback(async () => {
    dispatch(PricingRequestActions.fetchPricingRequestsPending());
    try {
      const response = await instance.get("/PricingRequests/my-requests");
      dispatch(
        PricingRequestActions.fetchPricingRequestsSuccess(response.data || []),
      );
    } catch {
      dispatch(PricingRequestActions.fetchPricingRequestsError());
    }
  }, [instance]);

  const createPricingRequest = useCallback(
    async (request: CreatePricingRequestDto) => {
      dispatch(PricingRequestActions.createPricingRequestPending());
      try {
        const response = await instance.post("/PricingRequests", request);
        dispatch(
          PricingRequestActions.createPricingRequestSuccess(response.data),
        );
        notification.success({
          title: "Success",
          description: "Pricing request created",
        });
      } catch {
        dispatch(PricingRequestActions.createPricingRequestError());
        notification.error({
          title: "Error",
          description: "Failed to create pricing request",
        });
      }
    },
    [instance, notification],
  );

  const updatePricingRequest = useCallback(
    async (id: string, request: UpdatePricingRequestDto) => {
      dispatch(PricingRequestActions.updatePricingRequestPending());
      try {
        const response = await instance.put(`/PricingRequests/${id}`, request);
        dispatch(
          PricingRequestActions.updatePricingRequestSuccess(response.data),
        );
        notification.success({
          title: "Success",
          description: "Pricing request updated",
        });
      } catch {
        dispatch(PricingRequestActions.updatePricingRequestError());
        notification.error({
          title: "Error",
          description: "Failed to update pricing request",
        });
      }
    },
    [instance, notification],
  );

  const deletePricingRequest = useCallback(
    async (id: string) => {
      dispatch(PricingRequestActions.deletePricingRequestPending());
      try {
        await instance.delete(`/PricingRequests/${id}`);
        dispatch(PricingRequestActions.deletePricingRequestSuccess(id));
        notification.success({
          title: "Success",
          description: "Pricing request deleted",
        });
      } catch {
        dispatch(PricingRequestActions.deletePricingRequestError());
        notification.error({
          title: "Error",
          description: "Failed to delete pricing request",
        });
      }
    },
    [instance, notification],
  );

  const completePricingRequest = useCallback(
    async (id: string) => {
      dispatch(PricingRequestActions.updatePricingRequestPending());
      try {
        const response = await instance.put(`/PricingRequests/${id}/complete`);
        dispatch(
          PricingRequestActions.updatePricingRequestSuccess(response.data),
        );
        notification.success({
          title: "Success",
          description: "Pricing request completed",
        });
      } catch {
        dispatch(PricingRequestActions.updatePricingRequestError());
        notification.error({
          title: "Error",
          description: "Failed to complete pricing request",
        });
      }
    },
    [instance, notification],
  );

  const assignPricingRequest = useCallback(
    async (id: string, userId: string) => {
      dispatch(PricingRequestActions.updatePricingRequestPending());
      try {
        const response = await instance.post(`/PricingRequests/${id}/assign`, {
          userId,
        });
        dispatch(
          PricingRequestActions.updatePricingRequestSuccess(response.data),
        );
        notification.success({
          title: "Success",
          description: "Pricing request assigned",
        });
      } catch {
        dispatch(PricingRequestActions.updatePricingRequestError());
        notification.error({
          title: "Error",
          description: "Failed to assign pricing request",
        });
      }
    },
    [instance, notification],
  );

  return (
    <PricingRequestStateContext.Provider value={state}>
      <PricingRequestActionContext.Provider
        value={{
          fetchPricingRequests,
          fetchPricingRequestById,
          fetchPendingRequests,
          fetchMyRequests,
          createPricingRequest,
          updatePricingRequest,
          deletePricingRequest,
          completePricingRequest,
          assignPricingRequest,
        }}
      >
        {children}
      </PricingRequestActionContext.Provider>
    </PricingRequestStateContext.Provider>
  );
};

export const usePricingRequestState = () => {
  const context = useContext(PricingRequestStateContext);
  if (!context)
    throw new Error(
      "usePricingRequestState must be used within PricingRequestProvider",
    );
  return context;
};
export const usePricingRequestActions = () => {
  const context = useContext(PricingRequestActionContext);
  if (!context)
    throw new Error(
      "usePricingRequestActions must be used within PricingRequestProvider",
    );
  return context;
};
