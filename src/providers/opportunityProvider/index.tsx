"use client";

import { useContext, useReducer, useCallback } from "react";
import { App } from "antd";
import { getAxiosInstance } from "@/utils/axiosInstance";
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
  const { notification } = App.useApp();

  const fetchOpportunities = useCallback(
    async (params?: OpportunityQueryParams) => {
      dispatch(OpportunityActions.fetchOpportunitiesPending());
      try {
        const response = await instance.get("/Opportunities", { params });
        dispatch(
          OpportunityActions.fetchOpportunitiesSuccess(
            response.data.items || [],
          ),
        );
      } catch {
        dispatch(OpportunityActions.fetchOpportunitiesError());
        notification.error({
          title: "Error",
          description: "Failed to fetch opportunities",
        });
      }
    },
    [instance, notification],
  );

  const fetchOpportunityById = useCallback(
    async (id: string) => {
      dispatch(OpportunityActions.fetchOpportunityByIdPending());
      try {
        const response = await instance.get(`/Opportunities/${id}`);
        dispatch(OpportunityActions.fetchOpportunityByIdSuccess(response.data));
      } catch {
        dispatch(OpportunityActions.fetchOpportunityByIdError());
        notification.error({
          title: "Error",
          description: "Failed to fetch opportunity",
        });
      }
    },
    [instance, notification],
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
      dispatch(OpportunityActions.createOpportunityPending());
      try {
        const response = await instance.post("/Opportunities", opportunity);
        dispatch(OpportunityActions.createOpportunitySuccess(response.data));
        notification.success({
          title: "Success",
          description: "Opportunity created",
        });
      } catch {
        dispatch(OpportunityActions.createOpportunityError());
        notification.error({
          title: "Error",
          description: "Failed to create opportunity",
        });
      }
    },
    [instance, notification],
  );

  const updateOpportunity = useCallback(
    async (id: string, opportunity: UpdateOpportunityDto) => {
      dispatch(OpportunityActions.updateOpportunityPending());
      try {
        const response = await instance.put(
          `/Opportunities/${id}`,
          opportunity,
        );
        dispatch(OpportunityActions.updateOpportunitySuccess(response.data));
        notification.success({
          title: "Success",
          description: "Opportunity updated",
        });
      } catch {
        dispatch(OpportunityActions.updateOpportunityError());
        notification.error({
          title: "Error",
          description: "Failed to update opportunity",
        });
      }
    },
    [instance, notification],
  );

  const deleteOpportunity = useCallback(
    async (id: string) => {
      dispatch(OpportunityActions.deleteOpportunityPending());
      try {
        await instance.delete(`/Opportunities/${id}`);
        dispatch(OpportunityActions.deleteOpportunitySuccess(id));
        notification.success({
          title: "Success",
          description: "Opportunity deleted",
        });
      } catch {
        dispatch(OpportunityActions.deleteOpportunityError());
        notification.error({
          title: "Error",
          description: "Failed to delete opportunity",
        });
      }
    },
    [instance, notification],
  );

  const updateStage = useCallback(
    async (id: string, data: UpdateStageDto) => {
      dispatch(OpportunityActions.updateStagePending());
      try {
        const response = await instance.put(`/Opportunities/${id}/stage`, data);
        dispatch(OpportunityActions.updateStageSuccess(response.data));
        notification.success({
          title: "Success",
          description: "Stage updated",
        });
      } catch {
        dispatch(OpportunityActions.updateStageError());
        notification.error({
          title: "Error",
          description: "Failed to update stage",
        });
      }
    },
    [instance, notification],
  );

  const assignOpportunity = useCallback(
    async (id: string, data: AssignOpportunityDto) => {
      dispatch(OpportunityActions.assignOpportunityPending());
      try {
        const response = await instance.post(
          `/Opportunities/${id}/assign`,
          data,
        );
        dispatch(OpportunityActions.assignOpportunitySuccess(response.data));
        notification.success({
          title: "Success",
          description: "Opportunity assigned",
        });
      } catch {
        dispatch(OpportunityActions.assignOpportunityError());
        notification.error({
          title: "Error",
          description: "Failed to assign opportunity",
        });
      }
    },
    [instance, notification],
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
