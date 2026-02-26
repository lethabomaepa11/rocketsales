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
  const { notification } = App.useApp();

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
        notification.error({
          title: "Error",
          description: "Failed to fetch contracts",
        });
      }
    },
    [instance, notification],
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
        notification.success({
          title: "Success",
          description: "Contract created",
        });
      } catch {
        dispatch(ContractActions.createContractError());
        notification.error({
          title: "Error",
          description: "Failed to create contract",
        });
      }
    },
    [instance, notification],
  );

  const updateContract = useCallback(
    async (id: string, contract: UpdateContractDto) => {
      dispatch(ContractActions.updateContractPending());
      try {
        const response = await instance.put(`/Contracts/${id}`, contract);
        dispatch(ContractActions.updateContractSuccess(response.data));
        notification.success({
          title: "Success",
          description: "Contract updated",
        });
      } catch {
        dispatch(ContractActions.updateContractError());
        notification.error({
          title: "Error",
          description: "Failed to update contract",
        });
      }
    },
    [instance, notification],
  );

  const deleteContract = useCallback(
    async (id: string) => {
      dispatch(ContractActions.deleteContractPending());
      try {
        await instance.delete(`/Contracts/${id}`);
        dispatch(ContractActions.deleteContractSuccess(id));
        notification.success({
          title: "Success",
          description: "Contract deleted",
        });
      } catch {
        dispatch(ContractActions.deleteContractError());
        notification.error({
          title: "Error",
          description: "Failed to delete contract",
        });
      }
    },
    [instance, notification],
  );

  const activateContract = useCallback(
    async (id: string) => {
      dispatch(ContractActions.updateContractPending());
      try {
        const response = await instance.put(`/Contracts/${id}/activate`);
        dispatch(ContractActions.updateContractSuccess(response.data));
        notification.success({
          title: "Success",
          description: "Contract activated",
        });
      } catch {
        dispatch(ContractActions.updateContractError());
        notification.error({
          title: "Error",
          description: "Failed to activate contract",
        });
      }
    },
    [instance, notification],
  );

  const cancelContract = useCallback(
    async (id: string) => {
      dispatch(ContractActions.updateContractPending());
      try {
        const response = await instance.put(`/Contracts/${id}/cancel`);
        dispatch(ContractActions.updateContractSuccess(response.data));
        notification.success({
          title: "Success",
          description: "Contract cancelled",
        });
      } catch {
        dispatch(ContractActions.updateContractError());
        notification.error({
          title: "Error",
          description: "Failed to cancel contract",
        });
      }
    },
    [instance, notification],
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
        notification.success({ message: "Renewal created" });
      } catch {
        notification.error({ message: "Failed to create renewal" });
      }
    },
    [instance, notification],
  );

  const completeRenewal = useCallback(
    async (renewalId: string) => {
      try {
        const response = await instance.put(
          `/Contracts/renewals/${renewalId}/complete`,
        );
        dispatch(ContractActions.createRenewalSuccess(response.data));
        notification.success({ message: "Renewal completed" });
      } catch {
        notification.error({ message: "Failed to complete renewal" });
      }
    },
    [instance, notification],
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
