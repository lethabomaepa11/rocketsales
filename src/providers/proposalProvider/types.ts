// Proposal Types from API Documentation

export interface ProposalDto {
  id: string;
  proposalNumber: string | null;
  opportunityId: string;
  opportunityTitle: string | null;
  clientId: string;
  clientName: string | null;
  title: string | null;
  description: string | null;
  status: ProposalStatus;
  statusName: string | null;
  totalAmount: number;
  currency: string | null;
  validUntil: string | null;
  submittedDate: string | null;
  approvedDate: string | null;
  createdById: string;
  createdByName: string | null;
  createdAt: string;
  updatedAt: string;
  lineItemsCount: number;
}

export interface ProposalLineItemDto {
  id: string;
  proposalId: string;
  productServiceName: string | null;
  description: string | null;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  totalPrice: number;
  sortOrder: number;
}

export interface ProposalWithLineItemsDto extends ProposalDto {
  lineItems: ProposalLineItemDto[] | null;
}

export interface CreateProposalDto {
  opportunityId: string;
  title: string | null;
  description: string | null;
  currency: string | null;
  validUntil: string | null;
  lineItems: CreateProposalLineItemDto[] | null;
}

export interface CreateProposalLineItemDto {
  productServiceName: string | null;
  description: string | null;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
}

export interface UpdateProposalDto {
  title: string | null;
  description: string | null;
  currency: string | null;
  validUntil: string | null;
}

export enum ProposalStatus {
  Draft = 1,
  Sent = 2,
  Viewed = 3,
  Accepted = 4,
  Rejected = 5,
  Expired = 6
}

export interface ProposalQueryParams {
  pageNumber?: number;
  pageSize?: number;
  opportunityId?: string;
  clientId?: string;
  status?: ProposalStatus;
  searchTerm?: string;
}
