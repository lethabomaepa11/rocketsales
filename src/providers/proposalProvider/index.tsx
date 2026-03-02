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
  CreateProposalLineItemDto,
  ProposalQueryParams,
} from "./types";

export const ProposalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(ProposalReducer, INITIAL_STATE);
  const instance = getAxiosInstance();
  const { notification, message } = App.useApp();

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
        message.error("Failed to fetch proposals");
      }
    },
    [instance, message],
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
        message.success("Proposal created");
      } catch {
        dispatch(ProposalActions.createProposalError());
        message.error("Failed to create proposal");
      }
    },
    [instance, message],
  );

  const updateProposal = useCallback(
    async (id: string, proposal: UpdateProposalDto) => {
      dispatch(ProposalActions.updateProposalPending());
      try {
        const response = await instance.put(`/Proposals/${id}`, proposal);
        dispatch(ProposalActions.updateProposalSuccess(response.data));
        message.success("Proposal updated");
      } catch {
        dispatch(ProposalActions.updateProposalError());
        message.error("Failed to update proposal");
      }
    },
    [instance, message],
  );

  const deleteProposal = useCallback(
    async (id: string) => {
      dispatch(ProposalActions.deleteProposalPending());
      try {
        await instance.delete(`/Proposals/${id}`);
        dispatch(ProposalActions.deleteProposalSuccess(id));
        message.success("Proposal deleted");
      } catch {
        dispatch(ProposalActions.deleteProposalError());
        message.error("Failed to delete proposal");
      }
    },
    [instance, message],
  );

  const submitProposal = useCallback(
    async (id: string) => {
      dispatch(ProposalActions.updateProposalPending());
      try {
        const response = await instance.put(`/Proposals/${id}/submit`);
        dispatch(ProposalActions.updateProposalSuccess(response.data));
        message.success("Proposal submitted");
      } catch {
        dispatch(ProposalActions.updateProposalError());
        message.error("Failed to submit proposal");
      }
    },
    [instance, message],
  );

  const approveProposal = useCallback(
    async (id: string) => {
      dispatch(ProposalActions.updateProposalPending());
      try {
        const response = await instance.put(`/Proposals/${id}/approve`);
        dispatch(ProposalActions.updateProposalSuccess(response.data));
        message.success("Proposal approved");
      } catch {
        dispatch(ProposalActions.updateProposalError());
        message.error("Failed to approve proposal");
      }
    },
    [instance, message],
  );

  const rejectProposal = useCallback(
    async (id: string) => {
      dispatch(ProposalActions.updateProposalPending());
      try {
        const response = await instance.put(`/Proposals/${id}/reject`);
        dispatch(ProposalActions.updateProposalSuccess(response.data));
        message.success("Proposal rejected");
      } catch {
        dispatch(ProposalActions.updateProposalError());
        message.error("Failed to reject proposal");
      }
    },
    [instance, message],
  );

  const addLineItem = useCallback(
    async (proposalId: string, item: CreateProposalLineItemDto) => {
      try {
        await instance.post(`/Proposals/${proposalId}/line-items`, item);
        const res = await instance.get(`/Proposals/${proposalId}`);
        dispatch(ProposalActions.setSelectedProposal(res.data));
        message.success("Line item added");
      } catch {
        message.error("Failed to add line item");
      }
    },
    [instance, message],
  );

  const updateLineItem = useCallback(
    async (
      proposalId: string,
      lineItemId: string,
      item: CreateProposalLineItemDto,
    ) => {
      try {
        await instance.put(
          `/Proposals/${proposalId}/line-items/${lineItemId}`,
          item,
        );
        const res = await instance.get(`/Proposals/${proposalId}`);
        dispatch(ProposalActions.setSelectedProposal(res.data));
        message.success("Line item updated");
      } catch {
        message.error("Failed to update line item");
      }
    },
    [instance, message],
  );

  const deleteLineItem = useCallback(
    async (proposalId: string, lineItemId: string) => {
      try {
        await instance.delete(
          `/Proposals/${proposalId}/line-items/${lineItemId}`,
        );
        const res = await instance.get(`/Proposals/${proposalId}`);
        dispatch(ProposalActions.setSelectedProposal(res.data));
        message.success("Line item removed");
      } catch {
        message.error("Failed to remove line item");
      }
    },
    [instance, message],
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
          addLineItem,
          updateLineItem,
          deleteLineItem,
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
