// Contact Types from API Documentation

export interface ContactDto {
  id: string;
  clientId: string;
  clientName: string | null;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  position: string | null;
  isPrimaryContact: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactDto {
  clientId: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;
  position: string | null;
  isPrimaryContact: boolean;
}

export interface UpdateContactDto {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;
  position: string | null;
  isPrimaryContact: boolean;
  isActive: boolean;
}

export interface ContactPagedResultDto {
  items: ContactDto[] | null;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ContactQueryParams {
  pageNumber?: number;
  pageSize?: number;
  clientId?: string;
  searchTerm?: string;
}
