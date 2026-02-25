"use client";

import { createContext } from "react";
import {
  ClientDto,
  ClientStatsDto,
  CreateClientDto,
  UpdateClientDto,
  ClientQueryParams,
} from "./types";

export interface IClientStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  clients: ClientDto[];
  selectedClient: ClientDto | null;
  clientStats: ClientStatsDto | null;
  pagination: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface IClientActionContext {
  fetchClients: (params?: ClientQueryParams) => void;
  fetchClientById: (id: string) => void;
  fetchClientStats: (id: string) => void;
  createClient: (client: CreateClientDto) => void;
  updateClient: (id: string, client: UpdateClientDto) => void;
  deleteClient: (id: string) => void;
  setSelectedClient: (client: ClientDto | null) => void;
}

export const INITIAL_STATE: IClientStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  clients: [],
  selectedClient: null,
  clientStats: null,
  pagination: {
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  },
};

export const ClientStateContext =
  createContext<IClientStateContext>(INITIAL_STATE);
export const ClientActionContext = createContext<IClientActionContext>(
  undefined as unknown as IClientActionContext,
);
