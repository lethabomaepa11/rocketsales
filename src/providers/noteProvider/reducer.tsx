"use client";

import { INoteStateContext } from "./context";
import * as NoteActions from "./actions";

export const NoteReducer = (
  state: INoteStateContext,
  action: { type: string; payload?: unknown },
): INoteStateContext => {
  switch (action.type) {
    case NoteActions.FETCH_NOTES_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case NoteActions.FETCH_NOTES_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        notes: action.payload as INoteStateContext["notes"],
      };
    case NoteActions.FETCH_NOTES_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };
    case NoteActions.CREATE_NOTE_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case NoteActions.CREATE_NOTE_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        notes: [
          action.payload as INoteStateContext["notes"][0],
          ...state.notes,
        ],
      };
    case NoteActions.CREATE_NOTE_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };
    case NoteActions.UPDATE_NOTE_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case NoteActions.UPDATE_NOTE_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        notes: state.notes.map((n) =>
          n.id === (action.payload as { id: string }).id
            ? (action.payload as INoteStateContext["notes"][0])
            : n,
        ),
      };
    case NoteActions.UPDATE_NOTE_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };
    case NoteActions.DELETE_NOTE_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case NoteActions.DELETE_NOTE_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        notes: state.notes.filter((n) => n.id !== action.payload),
      };
    case NoteActions.DELETE_NOTE_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };
    default:
      return state;
  }
};
