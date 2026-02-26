"use client";

import { useContext, useReducer, useCallback } from "react";
import { App } from "antd";
import { getAxiosInstance } from "@/utils/axiosInstance";
import {
  DocumentStateContext,
  DocumentActionContext,
  INITIAL_STATE,
} from "./context";
import { DocumentReducer } from "./reducer";
import * as DocActions from "./actions";
import { DocumentQueryParams, UploadDocumentParams } from "./types";

export const DocumentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(DocumentReducer, INITIAL_STATE);
  const instance = getAxiosInstance();
  const { notification } = App.useApp();

  const fetchDocuments = useCallback(
    async (params?: DocumentQueryParams) => {
      dispatch(DocActions.fetchDocumentsPending());
      try {
        const response = await instance.get("/Documents", { params });
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.items || [];
        dispatch(DocActions.fetchDocumentsSuccess(data));
      } catch {
        dispatch(DocActions.fetchDocumentsError());
        notification.error({
          message: "Error",
          description: "Failed to fetch documents",
        });
      }
    },
    [instance, notification],
  );

  const fetchDocumentById = useCallback(
    async (id: string) => {
      dispatch(DocActions.fetchDocumentsPending());
      try {
        const response = await instance.get(`/Documents/${id}`);
        dispatch(DocActions.fetchDocumentsSuccess([response.data]));
      } catch {
        dispatch(DocActions.fetchDocumentsError());
      }
    },
    [instance],
  );

  const uploadDocument = useCallback(
    async (params: UploadDocumentParams) => {
      dispatch(DocActions.uploadDocumentPending());
      try {
        const formData = new FormData();
        formData.append("File", params.file);
        if (params.category !== undefined)
          formData.append("Category", String(params.category));
        if (params.relatedToType !== undefined)
          formData.append("RelatedToType", String(params.relatedToType));
        if (params.relatedToId)
          formData.append("RelatedToId", params.relatedToId);
        if (params.description)
          formData.append("Description", params.description);

        const response = await instance.post("/Documents/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        dispatch(DocActions.uploadDocumentSuccess(response.data));
        notification.success({
          message: "Success",
          description: "Document uploaded",
        });
      } catch {
        dispatch(DocActions.uploadDocumentError());
        notification.error({
          message: "Error",
          description: "Failed to upload document",
        });
      }
    },
    [instance, notification],
  );

  const downloadDocument = useCallback(
    async (id: string, fileName: string) => {
      try {
        const response = await instance.get(`/Documents/${id}/download`, {
          responseType: "blob",
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName || "document");
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch {
        notification.error({
          message: "Error",
          description: "Failed to download document",
        });
      }
    },
    [instance, notification],
  );

  const deleteDocument = useCallback(
    async (id: string) => {
      dispatch(DocActions.deleteDocumentPending());
      try {
        await instance.delete(`/Documents/${id}`);
        dispatch(DocActions.deleteDocumentSuccess(id));
        notification.success({
          message: "Success",
          description: "Document deleted",
        });
      } catch {
        dispatch(DocActions.deleteDocumentError());
        notification.error({
          message: "Error",
          description: "Failed to delete document",
        });
      }
    },
    [instance, notification],
  );

  return (
    <DocumentStateContext.Provider value={state}>
      <DocumentActionContext.Provider
        value={{
          fetchDocuments,
          fetchDocumentById,
          uploadDocument,
          downloadDocument,
          deleteDocument,
        }}
      >
        {children}
      </DocumentActionContext.Provider>
    </DocumentStateContext.Provider>
  );
};

export const useDocumentState = () => {
  const context = useContext(DocumentStateContext);
  if (!context)
    throw new Error("useDocumentState must be used within DocumentProvider");
  return context;
};

export const useDocumentActions = () => {
  const context = useContext(DocumentActionContext);
  if (!context)
    throw new Error("useDocumentActions must be used within DocumentProvider");
  return context;
};
