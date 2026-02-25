"use client";

import { useContext, useReducer, useCallback } from "react";
import { App } from "antd";
import { getAxiosInstance } from "@/utils/axiosInstance";
import {
  ProposalStateContext,
  ProposalActionContext,
  INITIAL_STATE,
} from "./context";
import { ProposalReducer } from "./reducer";
import * as ProposalActions from "./actions";
import {
  CreateProposalDto,
  UpdateProposalDto,
  ProposalQueryParams,
} from "./types";

export const ProposalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(ProposalReducer, INITIAL_STATE);
  const instance = getAxiosInstance();
  const { notification } = App.useApp();

  const fetchProposals = useCallback(
    async (params?: ProposalQueryParams) => {
      dispatch(ProposalActions.fetchProposalsPending());
      try {
        const response = await instance.get("/Proposals", { params });
        dispatch(
          ProposalActions.fetchProposalsSuccess(response.data.items || []),
        );
      } catch {
        dispatch(ProposalActions.fetchProposalsError());
        notification.error({
          title: "Error",
          description: "Failed to fetch proposals",
        });
      }
    },
    [instance, notification],
  );

  const fetchProposalById = useCallback(
    async (id: string) => {
      dispatch(ProposalActions.fetchProposalsPending());
      try {
        const response = await instance.get(`/Proposals/${id}`);
        dispatch(ProposalActions.fetchProposalsSuccess([response.data]));
      } catch {
        dispatch(ProposalActions.fetchProposalsError());
      }
    },
    [instance],
  );

  const createProposal = useCallback(
    async (proposal: CreateProposalDto) => {
      dispatch(ProposalActions.createProposalPending());
      try {
        const response = await instance.post("/Proposals", proposal);
        dispatch(ProposalActions.createProposalSuccess(response.data));
        notification.success({
          title: "Success",
          description: "Proposal created",
        });
      } catch {
        dispatch(ProposalActions.createProposalError());
        notification.error({
          title: "Error",
          description: "Failed to create proposal",
        });
      }
    },
    [instance, notification],
  );

  const updateProposal = useCallback(
    async (id: string, proposal: UpdateProposalDto) => {
      dispatch(ProposalActions.updateProposalPending());
      try {
        const response = await instance.put(`/Proposals/${id}`, proposal);
        dispatch(ProposalActions.updateProposalSuccess(response.data));
        notification.success({
          title: "Success",
          description: "Proposal updated",
        });
      } catch {
        dispatch(ProposalActions.updateProposalError());
        notification.error({
          title: "Error",
          description: "Failed to update proposal",
        });
      }
    },
    [instance, notification],
  );

  const deleteProposal = useCallback(
    async (id: string) => {
      dispatch(ProposalActions.deleteProposalPending());
      try {
        await instance.delete(`/Proposals/${id}`);
        dispatch(ProposalActions.deleteProposalSuccess(id));
        notification.success({
          title: "Success",
          description: "Proposal deleted",
        });
      } catch {
        dispatch(ProposalActions.deleteProposalError());
        notification.error({
          title: "Error",
          description: "Failed to delete proposal",
        });
      }
    },
    [instance, notification],
  );

  const submitProposal = useCallback(
    async (id: string) => {
      dispatch(ProposalActions.updateProposalPending());
      try {
        const response = await instance.put(`/Proposals/${id}/submit`);
        dispatch(ProposalActions.updateProposalSuccess(response.data));
        notification.success({
          title: "Success",
          description: "Proposal submitted",
        });
      } catch {
        dispatch(ProposalActions.updateProposalError());
        notification.error({
          title: "Error",
          description: "Failed to submit proposal",
        });
      }
    },
    [instance, notification],
  );

  const approveProposal = useCallback(
    async (id: string) => {
      dispatch(ProposalActions.updateProposalPending());
      try {
        const response = await instance.put(`/Proposals/${id}/approve`);
        dispatch(ProposalActions.updateProposalSuccess(response.data));
        notification.success({
          title: "Success",
          description: "Proposal approved",
        });
      } catch {
        dispatch(ProposalActions.updateProposalError());
        notification.error({
          title: "Error",
          description: "Failed to approve proposal",
        });
      }
    },
    [instance, notification],
  );

  const rejectProposal = useCallback(
    async (id: string) => {
      dispatch(ProposalActions.updateProposalPending());
      try {
        const response = await instance.put(`/Proposals/${id}/reject`);
        dispatch(ProposalActions.updateProposalSuccess(response.data));
        notification.success({
          title: "Success",
          description: "Proposal rejected",
        });
      } catch {
        dispatch(ProposalActions.updateProposalError());
        notification.error({
          title: "Error",
          description: "Failed to reject proposal",
        });
      }
    },
    [instance, notification],
  );

  return (
    <ProposalStateContext.Provider value={state}>
      <ProposalActionContext.Provider
        value={{
          fetchProposals,
          fetchProposalById,
          createProposal,
          updateProposal,
          deleteProposal,
          submitProposal,
          approveProposal,
          rejectProposal,
        }}
      >
        {children}
      </ProposalActionContext.Provider>
    </ProposalStateContext.Provider>
  );
};

export const useProposalState = () => {
  const context = useContext(ProposalStateContext);
  if (!context)
    throw new Error("useProposalState must be used within ProposalProvider");
  return context;
};
export const useProposalActions = () => {
  const context = useContext(ProposalActionContext);
  if (!context)
    throw new Error("useProposalActions must be used within ProposalProvider");
  return context;
};
