export interface NoteDto {
  id: string;
  content: string | null;
  relatedToType: RelatedToType;
  relatedToTypeName: string | null;
  relatedToId: string;
  relatedToTitle: string | null;
  isPrivate: boolean;
  createdById: string;
  createdByName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteDto {
  content: string | null;
  relatedToType: RelatedToType;
  relatedToId: string;
  isPrivate: boolean;
}

export interface UpdateNoteDto {
  content: string | null;
  isPrivate: boolean;
}

export enum RelatedToType {
  Client = 1,
  Opportunity = 2,
  Proposal = 3,
  Contract = 4,
  Activity = 5,
}

export interface NoteQueryParams {
  pageNumber?: number;
  pageSize?: number;
  relatedToType?: RelatedToType;
  relatedToId?: string;
}