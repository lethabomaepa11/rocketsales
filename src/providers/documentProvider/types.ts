export interface DocumentDto {
  id: string;
  fileName: string | null;
  fileSize: number;
  contentType: string | null;
  category: DocumentCategory;
  categoryName: string | null;
  relatedToType: RelatedToType | null;
  relatedToTypeName: string | null;
  relatedToId: string | null;
  relatedToTitle: string | null;
  description: string | null;
  uploadedById: string;
  uploadedByName: string | null;
  createdAt: string;
  updatedAt: string;
}

export enum DocumentCategory {
  Contract = 1,
  Proposal = 2,
  Presentation = 3,
  Quote = 4,
  Report = 5,
  Other = 6,
}

export enum RelatedToType {
  Client = 1,
  Opportunity = 2,
  Proposal = 3,
  Contract = 4,
  Activity = 5,
}

export interface DocumentQueryParams {
  pageNumber?: number;
  pageSize?: number;
  relatedToType?: RelatedToType;
  relatedToId?: string;
  category?: DocumentCategory;
}

export interface UploadDocumentParams {
  file: File;
  category?: DocumentCategory;
  relatedToType?: RelatedToType;
  relatedToId?: string;
  description?: string;
}