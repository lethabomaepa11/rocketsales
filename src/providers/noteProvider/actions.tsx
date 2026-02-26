"use client";

export const FETCH_NOTES_PENDING = "FETCH_NOTES_PENDING";
export const FETCH_NOTES_SUCCESS = "FETCH_NOTES_SUCCESS";
export const FETCH_NOTES_ERROR = "FETCH_NOTES_ERROR";
export const CREATE_NOTE_PENDING = "CREATE_NOTE_PENDING";
export const CREATE_NOTE_SUCCESS = "CREATE_NOTE_SUCCESS";
export const CREATE_NOTE_ERROR = "CREATE_NOTE_ERROR";
export const UPDATE_NOTE_PENDING = "UPDATE_NOTE_PENDING";
export const UPDATE_NOTE_SUCCESS = "UPDATE_NOTE_SUCCESS";
export const UPDATE_NOTE_ERROR = "UPDATE_NOTE_ERROR";
export const DELETE_NOTE_PENDING = "DELETE_NOTE_PENDING";
export const DELETE_NOTE_SUCCESS = "DELETE_NOTE_SUCCESS";
export const DELETE_NOTE_ERROR = "DELETE_NOTE_ERROR";

export const fetchNotesPending = () => ({ type: FETCH_NOTES_PENDING });
export const fetchNotesSuccess = (payload: unknown) => ({
  type: FETCH_NOTES_SUCCESS,
  payload,
});
export const fetchNotesError = () => ({ type: FETCH_NOTES_ERROR });

export const createNotePending = () => ({ type: CREATE_NOTE_PENDING });
export const createNoteSuccess = (payload: unknown) => ({
  type: CREATE_NOTE_SUCCESS,
  payload,
});
export const createNoteError = () => ({ type: CREATE_NOTE_ERROR });

export const updateNotePending = () => ({ type: UPDATE_NOTE_PENDING });
export const updateNoteSuccess = (payload: unknown) => ({
  type: UPDATE_NOTE_SUCCESS,
  payload,
});
export const updateNoteError = () => ({ type: UPDATE_NOTE_ERROR });

export const deleteNotePending = () => ({ type: DELETE_NOTE_PENDING });
export const deleteNoteSuccess = (id: string) => ({
  type: DELETE_NOTE_SUCCESS,
  payload: id,
});
export const deleteNoteError = () => ({ type: DELETE_NOTE_ERROR });
