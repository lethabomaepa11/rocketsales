// Client Types from API Documentation

export interface ClientDto {
  id: string;
  name: string | null;
  industry: string | null;
  companySize: string | null;
  website: string | null;
  billingAddress: string | null;
  taxNumber: string | null;
  clientType: ClientType;
  isActive: boolean;
  createdById: string;
  createdByName: string | null;
  createdAt: string;
  updatedAt: string;
  contactsCount: number;
  opportunitiesCount: number;
  contractsCount: number;
}

export interface CreateClientDto {
  name: string | null;
  industry: string | null;
  companySize: string | null;
  website: string | null;
  billingAddress: string | null;
  taxNumber: string | null;
  clientType: ClientType;
}

export interface UpdateClientDto {
  name: string | null;
  industry: string | null;
  companySize: string | null;
  website: string | null;
  billingAddress: string | null;
  taxNumber: string | null;
  clientType: ClientType;
  isActive: boolean;
}

export interface ClientStatsDto {
  totalContacts: number;
  totalOpportunities: number;
  totalContracts: number;
  totalContractValue: number;
  activeOpportunities: number;
}

export interface ClientPagedResultDto {
  items: ClientDto[] | null;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export enum ClientType {
  Prospect = 1,
  Customer = 2,
  Partner = 3
}

export interface ClientQueryParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  industry?: string;
  isActive?: boolean;
}
