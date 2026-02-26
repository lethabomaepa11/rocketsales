"use client";

import { useContext, useReducer, useCallback } from "react";
import { App } from "antd";
import { getAxiosInstance } from "@/utils/axiosInstance";
import { NoteStateContext, NoteActionContext, INITIAL_STATE } from "./context";
import { NoteReducer } from "./reducer";
import * as NoteActions from "./actions";
import { CreateNoteDto, UpdateNoteDto, NoteQueryParams } from "./types";

export const NoteProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(NoteReducer, INITIAL_STATE);
  const instance = getAxiosInstance();
  const { notification } = App.useApp();

  const fetchNotes = useCallback(
    async (params?: NoteQueryParams) => {
      dispatch(NoteActions.fetchNotesPending());
      try {
        const response = await instance.get("/Notes", { params });
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.items || [];
        dispatch(NoteActions.fetchNotesSuccess(data));
      } catch {
        dispatch(NoteActions.fetchNotesError());
        notification.error({
          message: "Error",
          description: "Failed to fetch notes",
        });
      }
    },
    [instance, notification],
  );

  const fetchNoteById = useCallback(
    async (id: string) => {
      dispatch(NoteActions.fetchNotesPending());
      try {
        const response = await instance.get(`/Notes/${id}`);
        dispatch(NoteActions.fetchNotesSuccess([response.data]));
      } catch {
        dispatch(NoteActions.fetchNotesError());
      }
    },
    [instance],
  );

  const createNote = useCallback(
    async (note: CreateNoteDto) => {
      dispatch(NoteActions.createNotePending());
      try {
        const response = await instance.post("/Notes", note);
        dispatch(NoteActions.createNoteSuccess(response.data));
        notification.success({
          message: "Success",
          description: "Note created",
        });
      } catch {
        dispatch(NoteActions.createNoteError());
        notification.error({
          message: "Error",
          description: "Failed to create note",
        });
      }
    },
    [instance, notification],
  );

  const updateNote = useCallback(
    async (id: string, note: UpdateNoteDto) => {
      dispatch(NoteActions.updateNotePending());
      try {
        const response = await instance.put(`/Notes/${id}`, note);
        dispatch(NoteActions.updateNoteSuccess(response.data));
        notification.success({
          message: "Success",
          description: "Note updated",
        });
      } catch {
        dispatch(NoteActions.updateNoteError());
        notification.error({
          message: "Error",
          description: "Failed to update note",
        });
      }
    },
    [instance, notification],
  );

  const deleteNote = useCallback(
    async (id: string) => {
      dispatch(NoteActions.deleteNotePending());
      try {
        await instance.delete(`/Notes/${id}`);
        dispatch(NoteActions.deleteNoteSuccess(id));
        notification.success({
          message: "Success",
          description: "Note deleted",
        });
      } catch {
        dispatch(NoteActions.deleteNoteError());
        notification.error({
          message: "Error",
          description: "Failed to delete note",
        });
      }
    },
    [instance, notification],
  );

  return (
    <NoteStateContext.Provider value={state}>
      <NoteActionContext.Provider
        value={{
          fetchNotes,
          fetchNoteById,
          createNote,
          updateNote,
          deleteNote,
        }}
      >
        {children}
      </NoteActionContext.Provider>
    </NoteStateContext.Provider>
  );
};

export const useNoteState = () => {
  const context = useContext(NoteStateContext);
  if (!context)
    throw new Error("useNoteState must be used within NoteProvider");
  return context;
};

export const useNoteActions = () => {
  const context = useContext(NoteActionContext);
  if (!context)
    throw new Error("useNoteActions must be used within NoteProvider");
  return context;
};
