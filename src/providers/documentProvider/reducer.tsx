"use client";

import { IDocumentStateContext } from "./context";
import * as DocActions from "./actions";

export const DocumentReducer = (
  state: IDocumentStateContext,
  action: { type: string; payload?: unknown },
): IDocumentStateContext => {
  switch (action.type) {
    case DocActions.FETCH_DOCUMENTS_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case DocActions.FETCH_DOCUMENTS_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        documents: action.payload as IDocumentStateContext["documents"],
      };
    case DocActions.FETCH_DOCUMENTS_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };
    case DocActions.UPLOAD_DOCUMENT_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case DocActions.UPLOAD_DOCUMENT_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        documents: [
          action.payload as IDocumentStateContext["documents"][0],
          ...state.documents,
        ],
      };
    case DocActions.UPLOAD_DOCUMENT_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };
    case DocActions.DELETE_DOCUMENT_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case DocActions.DELETE_DOCUMENT_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        documents: state.documents.filter((d) => d.id !== action.payload),
      };
    case DocActions.DELETE_DOCUMENT_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };
    default:
      return state;
  }
};
