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
  OpportunityStateContext,
  OpportunityActionContext,
  INITIAL_STATE,
  IOpportunityStateContext,
} from "./context";
import { OpportunityReducer } from "./reducer";
import * as OpportunityActions from "./actions";
import {
  OpportunityQueryParams,
  CreateOpportunityDto,
  UpdateOpportunityDto,
  UpdateStageDto,
  AssignOpportunityDto,
} from "./types";

export const OpportunityProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(OpportunityReducer, INITIAL_STATE);
  const instance = getAxiosInstance();
  const { notification, message } = App.useApp();

  const ensureSalesRepCanModifyOpportunity = useCallback(
    async (id: string): Promise<boolean> => {
      if (!isSalesRep()) {
        return true;
      }

      const currentUserId = getCurrentUser()?.userId;
      if (!currentUserId) {
        notification.warning({
          title: "Access denied",
          description: "Unable to validate your user scope.",
        });
        return false;
      }

      try {
        const response = await instance.get(`/Opportunities/${id}`);
        const ownerId = response.data?.ownerId as string | undefined;

        if (ownerId !== currentUserId) {
          notification.warning({
            title: "Access denied",
            description:
              "Sales reps can only update opportunities assigned to them.",
          });
          return false;
        }

        return true;
      } catch {
        notification.error({
          title: "Error",
          description: "Failed to verify opportunity access",
        });
        return false;
      }
    },
    [instance, notification],
  );

  const fetchOpportunities = useCallback(
    async (params?: OpportunityQueryParams) => {
      dispatch(OpportunityActions.fetchOpportunitiesPending());
      try {
        const response = isSalesRep()
          ? await instance.get("/Opportunities/my-opportunities")
          : await instance.get("/Opportunities", { params });

        dispatch(
          OpportunityActions.fetchOpportunitiesSuccess(
            isSalesRep() ? response.data || [] : response.data.items || [],
          ),
        );
      } catch {
        dispatch(OpportunityActions.fetchOpportunitiesError());
        message.error("Failed to fetch opportunities");
      }
    },
    [instance, message],
  );

  const fetchOpportunityById = useCallback(
    async (id: string) => {
      dispatch(OpportunityActions.fetchOpportunityByIdPending());
      try {
        const response = await instance.get(`/Opportunities/${id}`);

        if (isSalesRep()) {
          const currentUserId = getCurrentUser()?.userId;
          if (!currentUserId || response.data?.ownerId !== currentUserId) {
            dispatch(OpportunityActions.fetchOpportunityByIdError());
            notification.warning({
              title: "Access denied",
              description:
                "Sales reps can only view opportunities assigned to them.",
            });
            return;
          }
        }

        dispatch(OpportunityActions.fetchOpportunityByIdSuccess(response.data));
      } catch {
        dispatch(OpportunityActions.fetchOpportunityByIdError());
        message.error("Failed to fetch opportunity");
      }
    },
    [instance, message, notification],
  );

  const fetchPipeline = useCallback(async () => {
    dispatch(OpportunityActions.fetchPipelinePending());
    try {
      const response = await instance.get("/Opportunities/pipeline");
      dispatch(OpportunityActions.fetchPipelineSuccess(response.data));
    } catch {
      dispatch(OpportunityActions.fetchPipelineError());
    }
  }, [instance]);

  const fetchMyOpportunities = useCallback(async () => {
    dispatch(OpportunityActions.fetchOpportunitiesPending());
    try {
      const response = await instance.get("/Opportunities/my-opportunities");
      dispatch(
        OpportunityActions.fetchOpportunitiesSuccess(response.data || []),
      );
    } catch {
      dispatch(OpportunityActions.fetchOpportunitiesError());
    }
  }, [instance]);

  const fetchStageHistory = useCallback(
    async (id: string) => {
      dispatch(OpportunityActions.fetchStageHistoryPending());
      try {
        const response = await instance.get(
          `/Opportunities/${id}/stage-history`,
        );
        dispatch(
          OpportunityActions.fetchStageHistorySuccess(response.data || []),
        );
      } catch {
        dispatch(OpportunityActions.fetchStageHistoryError());
      }
    },
    [instance],
  );

  const createOpportunity = useCallback(
    async (opportunity: CreateOpportunityDto) => {
      if (isSalesRep()) {
        notification.warning({
          title: "Access denied",
          description: "Sales reps cannot create opportunities.",
        });
        return;
      }

      dispatch(OpportunityActions.createOpportunityPending());
      try {
        const response = await instance.post("/Opportunities", opportunity);
        dispatch(OpportunityActions.createOpportunitySuccess(response.data));
        message.success("Opportunity created");
      } catch {
        dispatch(OpportunityActions.createOpportunityError());
        message.error("Failed to create opportunity");
      }
    },
    [instance, message, notification],
  );

  const updateOpportunity = useCallback(
    async (id: string, opportunity: UpdateOpportunityDto) => {
      const hasAccess = await ensureSalesRepCanModifyOpportunity(id);
      if (!hasAccess) {
        return;
      }

      dispatch(OpportunityActions.updateOpportunityPending());
      try {
        const response = await instance.put(
          `/Opportunities/${id}`,
          opportunity,
        );
        dispatch(OpportunityActions.updateOpportunitySuccess(response.data));
        message.success("Opportunity updated");
      } catch {
        dispatch(OpportunityActions.updateOpportunityError());
        message.error("Failed to update opportunity");
      }
    },
    [ensureSalesRepCanModifyOpportunity, instance, message],
  );

  const deleteOpportunity = useCallback(
    async (id: string) => {
      if (isSalesRep()) {
        notification.warning({
          title: "Access denied",
          description: "Sales reps cannot delete opportunities.",
        });
        return;
      }

      dispatch(OpportunityActions.deleteOpportunityPending());
      try {
        await instance.delete(`/Opportunities/${id}`);
        dispatch(OpportunityActions.deleteOpportunitySuccess(id));
        message.success("Opportunity deleted");
      } catch {
        dispatch(OpportunityActions.deleteOpportunityError());
        message.error("Failed to delete opportunity");
      }
    },
    [instance, message, notification],
  );

  const updateStage = useCallback(
    async (id: string, data: UpdateStageDto) => {
      const hasAccess = await ensureSalesRepCanModifyOpportunity(id);
      if (!hasAccess) {
        throw new Error("Access denied");
      }

      dispatch(OpportunityActions.updateStagePending());
      try {
        const response = await instance.put(`/Opportunities/${id}/stage`, data);
        dispatch(OpportunityActions.updateStageSuccess(response.data));
        message.success("Stage updated");
      } catch (error) {
        dispatch(OpportunityActions.updateStageError());
        message.error("Failed to update stage");
        throw error;
      }
    },
    [ensureSalesRepCanModifyOpportunity, instance, message],
  );

  const assignOpportunity = useCallback(
    async (id: string, data: AssignOpportunityDto) => {
      if (!isManagerOrAdmin()) {
        notification.warning({
          title: "Access denied",
          description:
            "Only Admin and Sales Manager users can assign opportunities.",
        });
        return;
      }

      dispatch(OpportunityActions.assignOpportunityPending());
      try {
        const response = await instance.post(
          `/Opportunities/${id}/assign`,
          data,
        );
        dispatch(OpportunityActions.assignOpportunitySuccess(response.data));
        message.success("Opportunity assigned");
      } catch {
        dispatch(OpportunityActions.assignOpportunityError());
        message.error("Failed to assign opportunity");
      }
    },
    [instance, message, notification],
  );

  const setSelectedOpportunity = useCallback(
    (opportunity: IOpportunityStateContext["selectedOpportunity"]) => {
      dispatch(OpportunityActions.setSelectedOpportunity(opportunity));
    },
    [],
  );

  return (
    <OpportunityStateContext.Provider value={state}>
      <OpportunityActionContext.Provider
        value={{
          fetchOpportunities,
          fetchOpportunityById,
          fetchPipeline,
          fetchMyOpportunities,
          fetchStageHistory,
          createOpportunity,
          updateOpportunity,
          deleteOpportunity,
          updateStage,
          assignOpportunity,
          setSelectedOpportunity,
        }}
      >
        {children}
      </OpportunityActionContext.Provider>
    </OpportunityStateContext.Provider>
  );
};

export const useOpportunityState = () => {
  const context = useContext(OpportunityStateContext);
  if (!context)
    throw new Error(
      "useOpportunityState must be used within OpportunityProvider",
    );
  return context;
};
export const useOpportunityActions = () => {
  const context = useContext(OpportunityActionContext);
  if (!context)
    throw new Error(
      "useOpportunityActions must be used within OpportunityProvider",
    );
  return context;
};
