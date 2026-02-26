"use client";

import { createContext } from "react";
import {
  DocumentDto,
  DocumentQueryParams,
  UploadDocumentParams,
} from "./types";

export interface IDocumentStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  documents: DocumentDto[];
  selectedDocument: DocumentDto | null;
}

export interface IDocumentActionContext {
  fetchDocuments: (params?: DocumentQueryParams) => void;
  fetchDocumentById: (id: string) => void;
  uploadDocument: (params: UploadDocumentParams) => void;
  downloadDocument: (id: string, fileName: string) => void;
  deleteDocument: (id: string) => void;
}

export const INITIAL_STATE: IDocumentStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  documents: [],
  selectedDocument: null,
};

export const DocumentStateContext =
  createContext<IDocumentStateContext>(INITIAL_STATE);
export const DocumentActionContext = createContext<IDocumentActionContext>(
  undefined as unknown as IDocumentActionContext,
);
