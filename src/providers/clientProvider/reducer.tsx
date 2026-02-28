"use client";

import { IClientStateContext } from "./context";
import * as ClientActions from "./actions";

export const ClientReducer = (
  state: IClientStateContext,
  action: { type: string; payload?: unknown },
): IClientStateContext => {
  switch (action.type) {
    // Fetch Clients
    case ClientActions.FETCH_CLIENTS_PENDING:
      return {
        ...state,
        isPending: true,
        isSuccess: false,
        isError: false,
      };
    case ClientActions.FETCH_CLIENTS_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        clients: (action.payload as IClientStateContext["clients"])?.filter(
          (client) => client.isActive !== false,
        ) as IClientStateContext["clients"],
      };
    case ClientActions.FETCH_CLIENTS_ERROR:
      return {
        ...state,
        isPending: false,
        isSuccess: false,
        isError: true,
      };

    // Fetch Client By ID
    case ClientActions.FETCH_CLIENT_BY_ID_PENDING:
      return {
        ...state,
        isPending: true,
        isSuccess: false,
        isError: false,
      };
    case ClientActions.FETCH_CLIENT_BY_ID_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        selectedClient: action.payload as IClientStateContext["selectedClient"],
      };
    case ClientActions.FETCH_CLIENT_BY_ID_ERROR:
      return {
        ...state,
        isPending: false,
        isSuccess: false,
        isError: true,
      };

    // Fetch Client Stats
    case ClientActions.FETCH_CLIENT_STATS_PENDING:
      return {
        ...state,
        isPending: true,
        isSuccess: false,
        isError: false,
      };
    case ClientActions.FETCH_CLIENT_STATS_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        clientStats: action.payload as IClientStateContext["clientStats"],
      };
    case ClientActions.FETCH_CLIENT_STATS_ERROR:
      return {
        ...state,
        isPending: false,
        isSuccess: false,
        isError: true,
      };

    // Create Client
    case ClientActions.CREATE_CLIENT_PENDING:
      return {
        ...state,
        isPending: true,
        isSuccess: false,
        isError: false,
      };
    case ClientActions.CREATE_CLIENT_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        clients: [
          action.payload,
          ...state.clients,
        ] as IClientStateContext["clients"],
      };
    case ClientActions.CREATE_CLIENT_ERROR:
      return {
        ...state,
        isPending: false,
        isSuccess: false,
        isError: true,
      };

    // Update Client
    case ClientActions.UPDATE_CLIENT_PENDING:
      return {
        ...state,
        isPending: true,
        isSuccess: false,
        isError: false,
      };
    case ClientActions.UPDATE_CLIENT_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        clients: state.clients.map((client) =>
          client.id === (action.payload as { id: string }).id
            ? (action.payload as IClientStateContext["clients"][0])
            : client,
        ) as IClientStateContext["clients"],
      };
    case ClientActions.UPDATE_CLIENT_ERROR:
      return {
        ...state,
        isPending: false,
        isSuccess: false,
        isError: true,
      };

    // Delete Client
    case ClientActions.DELETE_CLIENT_PENDING:
      return {
        ...state,
        isPending: true,
        isSuccess: false,
        isError: false,
      };
    case ClientActions.DELETE_CLIENT_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        clients: state.clients.filter(
          (client) => client.id !== action.payload,
        ) as IClientStateContext["clients"],
      };
    case ClientActions.DELETE_CLIENT_ERROR:
      return {
        ...state,
        isPending: false,
        isSuccess: false,
        isError: true,
      };

    // Set Selected Client
    case ClientActions.SET_SELECTED_CLIENT:
      return {
        ...state,
        selectedClient: action.payload as IClientStateContext["selectedClient"],
      };

    default:
      return state;
  }
};
