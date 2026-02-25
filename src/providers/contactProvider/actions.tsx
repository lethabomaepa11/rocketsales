"use client";

// Contact Action Types
export const FETCH_CONTACTS_PENDING = "FETCH_CONTACTS_PENDING";
export const FETCH_CONTACTS_SUCCESS = "FETCH_CONTACTS_SUCCESS";
export const FETCH_CONTACTS_ERROR = "FETCH_CONTACTS_ERROR";

export const FETCH_CONTACT_BY_ID_PENDING = "FETCH_CONTACT_BY_ID_PENDING";
export const FETCH_CONTACT_BY_ID_SUCCESS = "FETCH_CONTACT_BY_ID_SUCCESS";
export const FETCH_CONTACT_BY_ID_ERROR = "FETCH_CONTACT_BY_ID_ERROR";

export const CREATE_CONTACT_PENDING = "CREATE_CONTACT_PENDING";
export const CREATE_CONTACT_SUCCESS = "CREATE_CONTACT_SUCCESS";
export const CREATE_CONTACT_ERROR = "CREATE_CONTACT_ERROR";

export const UPDATE_CONTACT_PENDING = "UPDATE_CONTACT_PENDING";
export const UPDATE_CONTACT_SUCCESS = "UPDATE_CONTACT_SUCCESS";
export const UPDATE_CONTACT_ERROR = "UPDATE_CONTACT_ERROR";

export const DELETE_CONTACT_PENDING = "DELETE_CONTACT_PENDING";
export const DELETE_CONTACT_SUCCESS = "DELETE_CONTACT_SUCCESS";
export const DELETE_CONTACT_ERROR = "DELETE_CONTACT_ERROR";

export const SET_PRIMARY_CONTACT_PENDING = "SET_PRIMARY_CONTACT_PENDING";
export const SET_PRIMARY_CONTACT_SUCCESS = "SET_PRIMARY_CONTACT_SUCCESS";
export const SET_PRIMARY_CONTACT_ERROR = "SET_PRIMARY_CONTACT_ERROR";

export const SET_SELECTED_CONTACT = "SET_SELECTED_CONTACT";

// Action Creators
export const fetchContactsPending = () => ({ type: FETCH_CONTACTS_PENDING });
export const fetchContactsSuccess = (contacts: unknown[]) => ({
  type: FETCH_CONTACTS_SUCCESS,
  payload: contacts,
});
export const fetchContactsError = () => ({ type: FETCH_CONTACTS_ERROR });

export const fetchContactByIdPending = () => ({
  type: FETCH_CONTACT_BY_ID_PENDING,
});
export const fetchContactByIdSuccess = (contact: unknown) => ({
  type: FETCH_CONTACT_BY_ID_SUCCESS,
  payload: contact,
});
export const fetchContactByIdError = () => ({
  type: FETCH_CONTACT_BY_ID_ERROR,
});

export const createContactPending = () => ({ type: CREATE_CONTACT_PENDING });
export const createContactSuccess = (contact: unknown) => ({
  type: CREATE_CONTACT_SUCCESS,
  payload: contact,
});
export const createContactError = () => ({ type: CREATE_CONTACT_ERROR });

export const updateContactPending = () => ({ type: UPDATE_CONTACT_PENDING });
export const updateContactSuccess = (contact: unknown) => ({
  type: UPDATE_CONTACT_SUCCESS,
  payload: contact,
});
export const updateContactError = () => ({ type: UPDATE_CONTACT_ERROR });

export const deleteContactPending = () => ({ type: DELETE_CONTACT_PENDING });
export const deleteContactSuccess = (id: string) => ({
  type: DELETE_CONTACT_SUCCESS,
  payload: id,
});
export const deleteContactError = () => ({ type: DELETE_CONTACT_ERROR });

export const setPrimaryContactPending = () => ({
  type: SET_PRIMARY_CONTACT_PENDING,
});
export const setPrimaryContactSuccess = (contact: unknown) => ({
  type: SET_PRIMARY_CONTACT_SUCCESS,
  payload: contact,
});
export const setPrimaryContactError = () => ({
  type: SET_PRIMARY_CONTACT_ERROR,
});

export const setSelectedContact = (contact: unknown | null) => ({
  type: SET_SELECTED_CONTACT,
  payload: contact,
});
