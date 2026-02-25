// Contract Types from API Documentation

export interface ContractDto {
  id: string;
  contractNumber: string | null;
  clientId: string;
  clientName: string | null;
  opportunityId: string | null;
  opportunityTitle: string | null;
  proposalId: string | null;
  proposalNumber: string | null;
  title: string | null;
  contractValue: number;
  currency: string | null;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  statusName: string | null;
  renewalNoticePeriod: number;
  autoRenew: boolean;
  terms: string | null;
  ownerId: string;
  ownerName: string | null;
  createdAt: string;
  updatedAt: string;
  daysUntilExpiry: number;
  isExpiringSoon: boolean;
  renewalsCount: number;
}

export interface CreateContractDto {
  clientId: string;
  opportunityId: string | null;
  proposalId: string | null;
  title: string | null;
  contractValue: number;
  currency: string | null;
  startDate: string;
  endDate: string;
  renewalNoticePeriod: number;
  autoRenew: boolean;
  terms: string | null;
  ownerId: string;
}

export interface UpdateContractDto {
  title: string | null;
  contractValue: number;
  currency: string | null;
  endDate: string;
  renewalNoticePeriod: number;
  autoRenew: boolean;
  terms: string | null;
  ownerId: string;
}

export interface ContractRenewalDto {
  id: string;
  contractId: string;
  contractNumber: string | null;
  renewalOpportunityId: string | null;
  renewalOpportunityTitle: string | null;
  notificationSentDate: string | null;
  renewalDate: string | null;
  status: RenewalStatus;
  statusName: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContractRenewalDto {
  renewalOpportunityId: string | null;
  notes: string | null;
}

export enum ContractStatus {
  Draft = 1,
  Active = 2,
  Expired = 3,
  Cancelled = 4,
  Terminated = 5
}

export enum RenewalStatus {
  Pending = 1,
  Renewed = 2,
  Cancelled = 3,
  Expired = 4
}

export interface ContractQueryParams {
  pageNumber?: number;
  pageSize?: number;
  clientId?: string;
  status?: ContractStatus;
  searchTerm?: string;
}
