"use client";

import { useContext, useReducer, useCallback } from "react";
import { App } from "antd";
import { getAxiosInstance } from "@/utils/axiosInstance";
import {
  ContractStateContext,
  ContractActionContext,
  INITIAL_STATE,
} from "./context";
import { ContractReducer } from "./reducer";
import * as ContractActions from "./actions";
import {
  CreateContractDto,
  UpdateContractDto,
  ContractQueryParams,
  CreateContractRenewalDto,
} from "./types";

export const ContractProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(ContractReducer, INITIAL_STATE);
  const instance = getAxiosInstance();
  const { notification, message } = App.useApp();

  const fetchContracts = useCallback(
    async (params?: ContractQueryParams) => {
      dispatch(ContractActions.fetchContractsPending());
      try {
        const response = await instance.get("/Contracts", { params });
        dispatch(
          ContractActions.fetchContractsSuccess(response.data.items || []),
        );
      } catch {
        dispatch(ContractActions.fetchContractsError());
        message.error("Failed to fetch contracts");
      }
    },
    [instance, message],
  );

  const fetchContractById = useCallback(
    async (id: string) => {
      dispatch(ContractActions.fetchContractsPending());
      try {
        const response = await instance.get(`/Contracts/${id}`);
        dispatch(ContractActions.fetchContractsSuccess([response.data]));
      } catch {
        dispatch(ContractActions.fetchContractsError());
      }
    },
    [instance],
  );

  const fetchExpiringContracts = useCallback(async () => {
    dispatch(ContractActions.fetchContractsPending());
    try {
      const response = await instance.get("/Contracts/expiring");
      dispatch(ContractActions.fetchContractsSuccess(response.data || []));
    } catch {
      dispatch(ContractActions.fetchContractsError());
    }
  }, [instance]);

  const createContract = useCallback(
    async (contract: CreateContractDto) => {
      dispatch(ContractActions.createContractPending());
      try {
        const response = await instance.post("/Contracts", contract);
        dispatch(ContractActions.createContractSuccess(response.data));
        message.success("Contract created");
      } catch {
        dispatch(ContractActions.createContractError());
        message.error("Failed to create contract");
      }
    },
    [instance, message],
  );

  const updateContract = useCallback(
    async (id: string, contract: UpdateContractDto) => {
      dispatch(ContractActions.updateContractPending());
      try {
        const response = await instance.put(`/Contracts/${id}`, contract);
        dispatch(ContractActions.updateContractSuccess(response.data));
        message.success("Contract updated");
      } catch {
        dispatch(ContractActions.updateContractError());
        message.error("Failed to update contract");
      }
    },
    [instance, message],
  );

  const deleteContract = useCallback(
    async (id: string) => {
      dispatch(ContractActions.deleteContractPending());
      try {
        await instance.delete(`/Contracts/${id}`);
        dispatch(ContractActions.deleteContractSuccess(id));
        message.success("Contract deleted");
      } catch {
        dispatch(ContractActions.deleteContractError());
        message.error("Failed to delete contract");
      }
    },
    [instance, message],
  );

  const activateContract = useCallback(
    async (id: string) => {
      dispatch(ContractActions.updateContractPending());
      try {
        const response = await instance.put(`/Contracts/${id}/activate`);
        dispatch(ContractActions.updateContractSuccess(response.data));
        message.success("Contract activated");
      } catch {
        dispatch(ContractActions.updateContractError());
        message.error("Failed to activate contract");
      }
    },
    [instance, message],
  );

  const cancelContract = useCallback(
    async (id: string) => {
      dispatch(ContractActions.updateContractPending());
      try {
        const response = await instance.put(`/Contracts/${id}/cancel`);
        dispatch(ContractActions.updateContractSuccess(response.data));
        message.success("Contract cancelled");
      } catch {
        dispatch(ContractActions.updateContractError());
        message.error("Failed to cancel contract");
      }
    },
    [instance, message],
  );

  const fetchRenewals = useCallback(
    async (contractId: string) => {
      dispatch(ContractActions.fetchRenewalsPending());
      try {
        const response = await instance.get(
          `/Contracts/${contractId}/renewals`,
        );
        dispatch(ContractActions.fetchRenewalsSuccess(response.data || []));
      } catch {
        dispatch(ContractActions.fetchRenewalsError());
      }
    },
    [instance],
  );

  const createRenewal = useCallback(
    async (contractId: string, data: CreateContractRenewalDto) => {
      try {
        const response = await instance.post(
          `/Contracts/${contractId}/renewals`,
          data,
        );
        dispatch(ContractActions.createRenewalSuccess(response.data));
        message.success("Renewal created");
      } catch {
        message.error("Failed to create renewal");
      }
    },
    [instance, message],
  );

  const completeRenewal = useCallback(
    async (renewalId: string) => {
      try {
        const response = await instance.put(
          `/Contracts/renewals/${renewalId}/complete`,
        );
        dispatch(ContractActions.createRenewalSuccess(response.data));
        message.success("Renewal completed");
      } catch {
        message.error("Failed to complete renewal");
      }
    },
    [instance, message],
  );

  return (
    <ContractStateContext.Provider value={state}>
      <ContractActionContext.Provider
        value={{
          fetchContracts,
          fetchContractById,
          fetchExpiringContracts,
          createContract,
          updateContract,
          deleteContract,
          activateContract,
          cancelContract,
          fetchRenewals,
          createRenewal,
          completeRenewal,
        }}
      >
        {children}
      </ContractActionContext.Provider>
    </ContractStateContext.Provider>
  );
};

export const useContractState = () => {
  const context = useContext(ContractStateContext);
  if (!context)
    throw new Error("useContractState must be used within ContractProvider");
  return context;
};
export const useContractActions = () => {
  const context = useContext(ContractActionContext);
  if (!context)
    throw new Error("useContractActions must be used within ContractProvider");
  return context;
};
