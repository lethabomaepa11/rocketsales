"use client";

import { IContractStateContext } from "./context";
import * as ContractActions from "./actions";

export const ContractReducer = (
  state: IContractStateContext,
  action: { type: string; payload?: unknown },
): IContractStateContext => {
  switch (action.type) {
    case ContractActions.FETCH_CONTRACTS_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case ContractActions.FETCH_CONTRACTS_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        contracts: action.payload as IContractStateContext["contracts"],
      };
    case ContractActions.FETCH_CONTRACTS_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };
    case ContractActions.CREATE_CONTRACT_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case ContractActions.CREATE_CONTRACT_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        contracts: [
          action.payload as IContractStateContext["contracts"][0],
          ...state.contracts,
        ],
      };
    case ContractActions.CREATE_CONTRACT_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };
    case ContractActions.UPDATE_CONTRACT_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case ContractActions.UPDATE_CONTRACT_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        contracts: state.contracts.map((c) =>
          c.id === (action.payload as { id: string }).id
            ? (action.payload as IContractStateContext["contracts"][0])
            : c,
        ),
      };
    case ContractActions.UPDATE_CONTRACT_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };
    case ContractActions.DELETE_CONTRACT_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case ContractActions.DELETE_CONTRACT_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        contracts: state.contracts.filter((c) => c.id !== action.payload),
      };
    case ContractActions.DELETE_CONTRACT_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };
    case ContractActions.FETCH_RENEWALS_PENDING:
      return { ...state, isPending: true, isError: false };
    case ContractActions.FETCH_RENEWALS_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        renewals: action.payload as IContractStateContext["renewals"],
      };
    case ContractActions.FETCH_RENEWALS_ERROR:
      return { ...state, isPending: false, isError: true };
    case ContractActions.CREATE_RENEWAL_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        renewals: [
          action.payload as IContractStateContext["renewals"][0],
          ...state.renewals,
        ],
      };
    default:
      return state;
  }
};
