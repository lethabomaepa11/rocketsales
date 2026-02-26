"use client";

import { createContext } from "react";
import {
  NoteDto,
  CreateNoteDto,
  UpdateNoteDto,
  NoteQueryParams,
} from "./types";

export interface INoteStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  notes: NoteDto[];
  selectedNote: NoteDto | null;
}

export interface INoteActionContext {
  fetchNotes: (params?: NoteQueryParams) => void;
  fetchNoteById: (id: string) => void;
  createNote: (note: CreateNoteDto) => void;
  updateNote: (id: string, note: UpdateNoteDto) => void;
  deleteNote: (id: string) => void;
}

export const INITIAL_STATE: INoteStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  notes: [],
  selectedNote: null,
};

export const NoteStateContext = createContext<INoteStateContext>(INITIAL_STATE);
export const NoteActionContext = createContext<INoteActionContext>(
  undefined as unknown as INoteActionContext,
);
