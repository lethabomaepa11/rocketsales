"use client";

import { createContext } from "react";
import {
  OpportunityDto,
  CreateOpportunityDto,
  UpdateOpportunityDto,
  UpdateStageDto,
  OpportunityQueryParams,
  AssignOpportunityDto,
  PipelineMetricsDto,
  OpportunityStageHistoryDto,
} from "./types";

export interface IOpportunityStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  opportunities: OpportunityDto[];
  selectedOpportunity: OpportunityDto | null;
  stageHistory: OpportunityStageHistoryDto[];
  pipelineMetrics: PipelineMetricsDto | null;
  pagination: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface IOpportunityActionContext {
  fetchOpportunities: (params?: OpportunityQueryParams) => void;
  fetchOpportunityById: (id: string) => void;
  fetchPipeline: () => void;
  fetchMyOpportunities: () => void;
  fetchStageHistory: (id: string) => void;
  createOpportunity: (opportunity: CreateOpportunityDto) => void;
  updateOpportunity: (id: string, opportunity: UpdateOpportunityDto) => void;
  deleteOpportunity: (id: string) => void;
  updateStage: (id: string, data: UpdateStageDto) => void;
  assignOpportunity: (id: string, data: AssignOpportunityDto) => void;
  setSelectedOpportunity: (opportunity: OpportunityDto | null) => void;
}

export const INITIAL_STATE: IOpportunityStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  opportunities: [],
  selectedOpportunity: null,
  stageHistory: [],
  pipelineMetrics: null,
  pagination: { pageNumber: 1, pageSize: 10, totalCount: 0, totalPages: 0 },
};

export const OpportunityStateContext =
  createContext<IOpportunityStateContext>(INITIAL_STATE);
export const OpportunityActionContext =
  createContext<IOpportunityActionContext>(
    undefined as unknown as IOpportunityActionContext,
  );
