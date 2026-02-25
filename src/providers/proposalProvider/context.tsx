"use client";

import { createContext } from "react";
import {
  ProposalDto,
  CreateProposalDto,
  UpdateProposalDto,
  ProposalQueryParams,
} from "./types";

export interface IProposalStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  proposals: ProposalDto[];
  selectedProposal: ProposalDto | null;
  pagination: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface IProposalActionContext {
  fetchProposals: (params?: ProposalQueryParams) => void;
  fetchProposalById: (id: string) => void;
  createProposal: (proposal: CreateProposalDto) => void;
  updateProposal: (id: string, proposal: UpdateProposalDto) => void;
  deleteProposal: (id: string) => void;
  submitProposal: (id: string) => void;
  approveProposal: (id: string) => void;
  rejectProposal: (id: string) => void;
}

export const INITIAL_STATE: IProposalStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  proposals: [],
  selectedProposal: null,
  pagination: { pageNumber: 1, pageSize: 10, totalCount: 0, totalPages: 0 },
};

export const ProposalStateContext =
  createContext<IProposalStateContext>(INITIAL_STATE);
export const ProposalActionContext = createContext<IProposalActionContext>(
  undefined as unknown as IProposalActionContext,
);
