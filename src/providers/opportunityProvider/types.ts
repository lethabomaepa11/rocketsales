// Opportunity Types from API Documentation

export interface OpportunityDto {
  id: string;
  title: string | null;
  clientId: string;
  clientName: string | null;
  contactId: string | null;
  contactName: string | null;
  ownerId: string;
  ownerName: string | null;
  estimatedValue: number;
  currency: string | null;
  probability: number;
  stage: OpportunityStage;
  stageName: string | null;
  source: OpportunitySource;
  expectedCloseDate: string | null;
  actualCloseDate: string | null;
  description: string | null;
  lossReason: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
}

export interface CreateOpportunityDto {
  title: string | null;
  clientId: string;
  contactId: string | null;
  estimatedValue: number;
  currency: string | null;
  probability: number;
  source: OpportunitySource;
  expectedCloseDate: string | null;
  description: string | null;
}

export interface UpdateOpportunityDto {
  title: string | null;
  contactId: string | null;
  estimatedValue: number;
  currency: string | null;
  probability: number;
  source: OpportunitySource;
  expectedCloseDate: string | null;
  description: string | null;
}

export interface UpdateStageDto {
  newStage: OpportunityStage;
  notes: string | null;
  lossReason: string | null;
}

export interface AssignOpportunityDto {
  userId: string;
}

export interface OpportunityStageHistoryDto {
  id: string;
  opportunityId: string;
  fromStage: OpportunityStage;
  fromStageName: string | null;
  toStage: OpportunityStage;
  toStageName: string | null;
  changedById: string;
  changedByName: string | null;
  changedAt: string;
  notes: string | null;
}

export interface OpportunityPagedResultDto {
  items: OpportunityDto[] | null;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export enum OpportunityStage {
  Lead = 1,
  Qualified = 2,
  Proposal = 3,
  Negotiation = 4,
  ClosedWon = 5,
  ClosedLost = 6
}

export enum OpportunitySource {
  Inbound = 1,
  Outbound = 2,
  Referral = 3,
  Partner = 4,
  Other = 5
}

export interface OpportunityQueryParams {
  pageNumber?: number;
  pageSize?: number;
  clientId?: string;
  ownerId?: string;
  stage?: OpportunityStage;
  searchTerm?: string;
  isActive?: boolean;
}

export interface StageMetrics {
  stage: OpportunityStage;
  stageName: string | null;
  count: number;
  totalValue: number;
  weightedValue: number;
}

export interface PipelineMetricsDto {
  stageMetrics: {
    Lead?: StageMetrics;
    Qualified?: StageMetrics;
    Proposal?: StageMetrics;
    Negotiation?: StageMetrics;
    ClosedWon?: StageMetrics;
    ClosedLost?: StageMetrics;
  } | null;
  totalPipelineValue: number;
  weightedPipelineValue: number;
  totalOpportunities: number;
  activeOpportunities: number;
  averageDealSize: number;
  winRate: number;
}
