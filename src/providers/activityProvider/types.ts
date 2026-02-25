// Activity Types from API Documentation

export interface ActivityDto {
  id: string;
  type: ActivityType;
  typeName: string | null;
  subject: string | null;
  description: string | null;
  relatedToType: RelatedToType;
  relatedToTypeName: string | null;
  relatedToId: string;
  relatedToTitle: string | null;
  assignedToId: string;
  assignedToName: string | null;
  status: ActivityStatus;
  statusName: string | null;
  priority: Priority;
  priorityName: string | null;
  dueDate: string | null;
  completedDate: string | null;
  duration: number | null;
  location: string | null;
  outcome: string | null;
  createdById: string;
  createdByName: string | null;
  createdAt: string;
  updatedAt: string;
  isOverdue: boolean;
  participantsCount: number;
}

export interface CreateActivityDto {
  type: ActivityType;
  subject: string | null;
  description: string | null;
  relatedToType: RelatedToType;
  relatedToId: string;
  assignedToId: string;
  priority: Priority;
  dueDate: string | null;
  duration: number | null;
  location: string | null;
}

export interface UpdateActivityDto {
  subject: string | null;
  description: string | null;
  assignedToId: string;
  priority: Priority;
  dueDate: string | null;
  duration: number | null;
  location: string | null;
  outcome: string | null;
}

export interface CompleteActivityDto {
  outcome: string | null;
}

export interface ActivityParticipantDto {
  id: string;
  activityId: string;
  userId: string | null;
  userName: string | null;
  contactId: string | null;
  contactName: string | null;
  isRequired: boolean;
  responseStatus: ResponseStatus;
  responseStatusName: string | null;
}

export interface CreateActivityParticipantDto {
  userId: string | null;
  contactId: string | null;
  isRequired: boolean;
}

export enum ActivityType {
  Call = 1,
  Meeting = 2,
  Task = 3,
  Email = 4,
  Note = 5
}

export enum ActivityStatus {
  Pending = 1,
  InProgress = 2,
  Completed = 3
}

export enum RelatedToType {
  Client = 1,
  Opportunity = 2,
  Proposal = 3,
  Contract = 4,
  PricingRequest = 5
}

export enum Priority {
  Low = 1,
  Medium = 2,
  High = 3,
  Urgent = 4
}

export enum ResponseStatus {
  Pending = 1,
  Accepted = 2,
  Declined = 3,
  Tentative = 4
}

export interface ActivityQueryParams {
  pageNumber?: number;
  pageSize?: number;
  assignedToId?: string;
  type?: ActivityType;
  status?: ActivityStatus;
  relatedToType?: RelatedToType;
  relatedToId?: string;
  searchTerm?: string;
}
