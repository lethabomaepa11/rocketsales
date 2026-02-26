"use client";

export const FETCH_DOCUMENTS_PENDING = "FETCH_DOCUMENTS_PENDING";
export const FETCH_DOCUMENTS_SUCCESS = "FETCH_DOCUMENTS_SUCCESS";
export const FETCH_DOCUMENTS_ERROR = "FETCH_DOCUMENTS_ERROR";
export const UPLOAD_DOCUMENT_PENDING = "UPLOAD_DOCUMENT_PENDING";
export const UPLOAD_DOCUMENT_SUCCESS = "UPLOAD_DOCUMENT_SUCCESS";
export const UPLOAD_DOCUMENT_ERROR = "UPLOAD_DOCUMENT_ERROR";
export const DELETE_DOCUMENT_PENDING = "DELETE_DOCUMENT_PENDING";
export const DELETE_DOCUMENT_SUCCESS = "DELETE_DOCUMENT_SUCCESS";
export const DELETE_DOCUMENT_ERROR = "DELETE_DOCUMENT_ERROR";

export const fetchDocumentsPending = () => ({ type: FETCH_DOCUMENTS_PENDING });
export const fetchDocumentsSuccess = (payload: unknown) => ({
  type: FETCH_DOCUMENTS_SUCCESS,
  payload,
});
export const fetchDocumentsError = () => ({ type: FETCH_DOCUMENTS_ERROR });

export const uploadDocumentPending = () => ({ type: UPLOAD_DOCUMENT_PENDING });
export const uploadDocumentSuccess = (payload: unknown) => ({
  type: UPLOAD_DOCUMENT_SUCCESS,
  payload,
});
export const uploadDocumentError = () => ({ type: UPLOAD_DOCUMENT_ERROR });

export const deleteDocumentPending = () => ({ type: DELETE_DOCUMENT_PENDING });
export const deleteDocumentSuccess = (id: string) => ({
  type: DELETE_DOCUMENT_SUCCESS,
  payload: id,
});
export const deleteDocumentError = () => ({ type: DELETE_DOCUMENT_ERROR });
