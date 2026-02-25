"use client";

// Client Action Types
export const FETCH_CLIENTS_PENDING = "FETCH_CLIENTS_PENDING";
export const FETCH_CLIENTS_SUCCESS = "FETCH_CLIENTS_SUCCESS";
export const FETCH_CLIENTS_ERROR = "FETCH_CLIENTS_ERROR";

export const FETCH_CLIENT_BY_ID_PENDING = "FETCH_CLIENT_BY_ID_PENDING";
export const FETCH_CLIENT_BY_ID_SUCCESS = "FETCH_CLIENT_BY_ID_SUCCESS";
export const FETCH_CLIENT_BY_ID_ERROR = "FETCH_CLIENT_BY_ID_ERROR";

export const FETCH_CLIENT_STATS_PENDING = "FETCH_CLIENT_STATS_PENDING";
export const FETCH_CLIENT_STATS_SUCCESS = "FETCH_CLIENT_STATS_SUCCESS";
export const FETCH_CLIENT_STATS_ERROR = "FETCH_CLIENT_STATS_ERROR";

export const CREATE_CLIENT_PENDING = "CREATE_CLIENT_PENDING";
export const CREATE_CLIENT_SUCCESS = "CREATE_CLIENT_SUCCESS";
export const CREATE_CLIENT_ERROR = "CREATE_CLIENT_ERROR";

export const UPDATE_CLIENT_PENDING = "UPDATE_CLIENT_PENDING";
export const UPDATE_CLIENT_SUCCESS = "UPDATE_CLIENT_SUCCESS";
export const UPDATE_CLIENT_ERROR = "UPDATE_CLIENT_ERROR";

export const DELETE_CLIENT_PENDING = "DELETE_CLIENT_PENDING";
export const DELETE_CLIENT_SUCCESS = "DELETE_CLIENT_SUCCESS";
export const DELETE_CLIENT_ERROR = "DELETE_CLIENT_ERROR";

export const SET_SELECTED_CLIENT = "SET_SELECTED_CLIENT";

// Action Creators
export const fetchClientsPending = () => ({
  type: FETCH_CLIENTS_PENDING,
});

export const fetchClientsSuccess = (clients: unknown[]) => ({
  type: FETCH_CLIENTS_SUCCESS,
  payload: clients,
});

export const fetchClientsError = () => ({
  type: FETCH_CLIENTS_ERROR,
});

export const fetchClientByIdPending = () => ({
  type: FETCH_CLIENT_BY_ID_PENDING,
});

export const fetchClientByIdSuccess = (client: unknown) => ({
  type: FETCH_CLIENT_BY_ID_SUCCESS,
  payload: client,
});

export const fetchClientByIdError = () => ({
  type: FETCH_CLIENT_BY_ID_ERROR,
});

export const fetchClientStatsPending = () => ({
  type: FETCH_CLIENT_STATS_PENDING,
});

export const fetchClientStatsSuccess = (stats: unknown) => ({
  type: FETCH_CLIENT_STATS_SUCCESS,
  payload: stats,
});

export const fetchClientStatsError = () => ({
  type: FETCH_CLIENT_STATS_ERROR,
});

export const createClientPending = () => ({
  type: CREATE_CLIENT_PENDING,
});

export const createClientSuccess = (client: unknown) => ({
  type: CREATE_CLIENT_SUCCESS,
  payload: client,
});

export const createClientError = () => ({
  type: CREATE_CLIENT_ERROR,
});

export const updateClientPending = () => ({
  type: UPDATE_CLIENT_PENDING,
});

export const updateClientSuccess = (client: unknown) => ({
  type: UPDATE_CLIENT_SUCCESS,
  payload: client,
});

export const updateClientError = () => ({
  type: UPDATE_CLIENT_ERROR,
});

export const deleteClientPending = () => ({
  type: DELETE_CLIENT_PENDING,
});

export const deleteClientSuccess = (id: string) => ({
  type: DELETE_CLIENT_SUCCESS,
  payload: id,
});

export const deleteClientError = () => ({
  type: DELETE_CLIENT_ERROR,
});

export const setSelectedClient = (client: unknown | null) => ({
  type: SET_SELECTED_CLIENT,
  payload: client,
});
