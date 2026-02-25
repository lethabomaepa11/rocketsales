// Pricing Request Types from API Documentation

export interface PricingRequestDto {
  id: string;
  opportunityId: string;
  opportunityTitle: string | null;
  requestNumber: string | null;
  title: string | null;
  description: string | null;
  requestedById: string;
  requestedByName: string | null;
  assignedToId: string | null;
  assignedToName: string | null;
  status: PricingRequestStatus;
  statusName: string | null;
  priority: Priority;
  priorityName: string | null;
  requestedDate: string;
  requiredByDate: string | null;
  completedDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePricingRequestDto {
  opportunityId: string;
  title: string | null;
  description: string | null;
  assignedToId: string | null;
  priority: Priority;
  requiredByDate: string | null;
}

export interface UpdatePricingRequestDto {
  title: string | null;
  description: string | null;
  priority: Priority;
  requiredByDate: string | null;
}

export interface AssignPricingRequestDto {
  userId: string;
}

export enum PricingRequestStatus {
  Pending = 1,
  InProgress = 2,
  Completed = 3,
  Cancelled = 4
}

export enum Priority {
  Low = 1,
  Medium = 2,
  High = 3,
  Urgent = 4
}

export interface PricingRequestQueryParams {
  pageNumber?: number;
  pageSize?: number;
  status?: PricingRequestStatus;
  searchTerm?: string;
}
