"use client";

import { useContext, useReducer, useCallback } from "react";
import { App } from "antd";
import { getAxiosInstance } from "@/utils/axiosInstance";
import {
  getCurrentUser,
  isManagerOrAdmin,
  isSalesRep,
} from "@/utils/tenantUtils";
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

  const isPricingRequestOwnedByCurrentUser = useCallback((request: unknown) => {
    const currentUserId = getCurrentUser()?.userId;
    if (!currentUserId || !request || typeof request !== "object") {
      return false;
    }

    const record = request as {
      requestedById?: string;
      assignedToId?: string | null;
    };

    return (
      record.requestedById === currentUserId ||
      record.assignedToId === currentUserId
    );
  }, []);

  const blockSalesRepMutation = useCallback((): boolean => {
    if (!isSalesRep()) {
      return false;
    }

    notification.warning({
      title: "Access denied",
      description: "Sales reps can only create pricing requests.",
    });
    return true;
  }, [notification]);

  const fetchPricingRequests = useCallback(
    async (params?: PricingRequestQueryParams) => {
      dispatch(PricingRequestActions.fetchPricingRequestsPending());
      try {
        const response = isSalesRep()
          ? await instance.get("/PricingRequests/my-requests")
          : await instance.get("/PricingRequests", { params });

        dispatch(
          PricingRequestActions.fetchPricingRequestsSuccess(
            isSalesRep() ? response.data || [] : response.data.items || [],
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

        if (
          isSalesRep() &&
          !isPricingRequestOwnedByCurrentUser(response.data)
        ) {
          dispatch(PricingRequestActions.fetchPricingRequestsError());
          notification.warning({
            title: "Access denied",
            description:
              "Sales reps can only access their own pricing requests.",
          });
          return;
        }

        dispatch(
          PricingRequestActions.fetchPricingRequestsSuccess([response.data]),
        );
      } catch {
        dispatch(PricingRequestActions.fetchPricingRequestsError());
      }
    },
    [instance, isPricingRequestOwnedByCurrentUser, notification],
  );

  const fetchPendingRequests = useCallback(async () => {
    dispatch(PricingRequestActions.fetchPricingRequestsPending());
    try {
      if (isSalesRep()) {
        const response = await instance.get("/PricingRequests/my-requests");
        dispatch(
          PricingRequestActions.fetchPricingRequestsSuccess(
            response.data || [],
          ),
        );
        return;
      }

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
      if (blockSalesRepMutation()) {
        return;
      }

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
    [blockSalesRepMutation, instance, notification],
  );

  const deletePricingRequest = useCallback(
    async (id: string) => {
      if (blockSalesRepMutation()) {
        return;
      }

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
    [blockSalesRepMutation, instance, notification],
  );

  const completePricingRequest = useCallback(
    async (id: string) => {
      if (blockSalesRepMutation()) {
        return;
      }

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
    [blockSalesRepMutation, instance, notification],
  );

  const assignPricingRequest = useCallback(
    async (id: string, userId: string) => {
      if (isSalesRep()) {
        notification.warning({
          title: "Access denied",
          description: "Sales reps can only create pricing requests.",
        });
        return;
      }

      if (!isManagerOrAdmin()) {
        notification.warning({
          title: "Access denied",
          description:
            "Only Admin and Sales Manager users can assign pricing requests.",
        });
        return;
      }

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
