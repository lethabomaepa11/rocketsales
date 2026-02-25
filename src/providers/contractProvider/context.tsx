"use client";

import { createContext } from "react";
import {
  ContractDto,
  ContractQueryParams,
  CreateContractDto,
  UpdateContractDto,
} from "./types";

export interface IContractStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  contracts: ContractDto[];
}

export interface IContractActionContext {
  fetchContracts: (params?: ContractQueryParams) => void;
  fetchContractById: (id: string) => void;
  fetchExpiringContracts: () => void;
  createContract: (contract: CreateContractDto) => void;
  updateContract: (id: string, contract: UpdateContractDto) => void;
  deleteContract: (id: string) => void;
  activateContract: (id: string) => void;
  cancelContract: (id: string) => void;
}

export const INITIAL_STATE: IContractStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  contracts: [],
};

export const ContractStateContext =
  createContext<IContractStateContext>(INITIAL_STATE);
export const ContractActionContext = createContext<IContractActionContext>(
  undefined as unknown as IContractActionContext,
);
