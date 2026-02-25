"use client";

import { useContext, useReducer, useCallback } from "react";
import { App } from "antd";
import { getAxiosInstance } from "@/utils/axiosInstance";
import {
  ClientStateContext,
  ClientActionContext,
  INITIAL_STATE,
  IClientStateContext,
} from "./context";
import { ClientReducer } from "./reducer";
import * as ClientActions from "./actions";
import { ClientQueryParams, CreateClientDto, UpdateClientDto } from "./types";

export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(ClientReducer, INITIAL_STATE);
  const instance = getAxiosInstance();
  const { notification } = App.useApp();

  const fetchClients = useCallback(
    async (params?: ClientQueryParams) => {
      dispatch(ClientActions.fetchClientsPending());
      try {
        const response = await instance.get("/Clients", { params });
        dispatch(ClientActions.fetchClientsSuccess(response.data.items || []));
      } catch (error) {
        dispatch(ClientActions.fetchClientsError());
        notification.error({
          title: "Error",
          description: "Failed to fetch clients",
        });
      }
    },
    [instance, notification],
  );

  const fetchClientById = useCallback(
    async (id: string) => {
      dispatch(ClientActions.fetchClientByIdPending());
      try {
        const response = await instance.get(`/Clients/${id}`);
        dispatch(ClientActions.fetchClientByIdSuccess(response.data));
      } catch (error) {
        dispatch(ClientActions.fetchClientByIdError());
        notification.error({
          title: "Error",
          description: "Failed to fetch client details",
        });
      }
    },
    [instance, notification],
  );

  const fetchClientStats = useCallback(
    async (id: string) => {
      dispatch(ClientActions.fetchClientStatsPending());
      try {
        const response = await instance.get(`/Clients/${id}/stats`);
        dispatch(ClientActions.fetchClientStatsSuccess(response.data));
      } catch (error) {
        dispatch(ClientActions.fetchClientStatsError());
        notification.error({
          title: "Error",
          description: "Failed to fetch client stats",
        });
      }
    },
    [instance, notification],
  );

  const createClient = useCallback(
    async (client: CreateClientDto) => {
      dispatch(ClientActions.createClientPending());
      try {
        const response = await instance.post("/Clients", client);
        dispatch(ClientActions.createClientSuccess(response.data));
        notification.success({
          title: "Success",
          description: "Client created successfully",
        });
      } catch (error) {
        dispatch(ClientActions.createClientError());
        notification.error({
          title: "Error",
          description: "Failed to create client",
        });
      }
    },
    [instance, notification],
  );

  const updateClient = useCallback(
    async (id: string, client: UpdateClientDto) => {
      dispatch(ClientActions.updateClientPending());
      try {
        const response = await instance.put(`/Clients/${id}`, client);
        dispatch(ClientActions.updateClientSuccess(response.data));
        notification.success({
          title: "Success",
          description: "Client updated successfully",
        });
      } catch (error) {
        dispatch(ClientActions.updateClientError());
        notification.error({
          title: "Error",
          description: "Failed to update client",
        });
      }
    },
    [instance, notification],
  );

  const deleteClient = useCallback(
    async (id: string) => {
      dispatch(ClientActions.deleteClientPending());
      try {
        await instance.delete(`/Clients/${id}`);
        dispatch(ClientActions.deleteClientSuccess(id));
        notification.success({
          title: "Success",
          description: "Client deleted successfully",
        });
      } catch (error) {
        dispatch(ClientActions.deleteClientError());
        notification.error({
          title: "Error",
          description: "Failed to delete client",
        });
      }
    },
    [instance, notification],
  );

  const setSelectedClient = useCallback(
    (client: IClientStateContext["selectedClient"]) => {
      dispatch(ClientActions.setSelectedClient(client));
    },
    [],
  );

  return (
    <ClientStateContext.Provider value={state}>
      <ClientActionContext.Provider
        value={{
          fetchClients,
          fetchClientById,
          fetchClientStats,
          createClient,
          updateClient,
          deleteClient,
          setSelectedClient,
        }}
      >
        {children}
      </ClientActionContext.Provider>
    </ClientStateContext.Provider>
  );
};

export const useClientState = () => {
  const context = useContext(ClientStateContext);
  if (!context) {
    throw new Error("useClientState must be used within a ClientProvider");
  }
  return context;
};

export const useClientActions = () => {
  const context = useContext(ClientActionContext);
  if (!context) {
    throw new Error("useClientActions must be used within a ClientProvider");
  }
  return context;
};
